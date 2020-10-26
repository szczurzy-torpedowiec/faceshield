/* global __static */

import {
  app, protocol, BrowserWindow, Menu, Tray, nativeImage, shell, globalShortcut,
} from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import path from 'path';
import parseArgs from 'minimist';
import createConfigStore from './stores/config';
import createTrackingStore from './stores/tracking';
import RendererCommunication from './renderer-communication';
import OverlayCommunication from './overlay-communication';
import TrackerManager from './tracker-manager';

const argv = parseArgs(process.argv.slice(1));
const isDevelopment = process.env.NODE_ENV !== 'production';

if (isDevelopment) {
  app.setPath('userData', path.join(app.getPath('appData'), `${app.getName()}-development`));
}

const configStore = createConfigStore(app.getPath('userData'));
const trackingStore = createTrackingStore(app.getPath('userData'));

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = null;
let overlayWin = null;
let tray = null;

const gifSaveFolder = path.join(app.getPath('userData'), 'recordings');
const trackerManager = new TrackerManager({
  trackingStore,
  configStore,
  gifSaveFolder,
});
const rendererCommunication = new RendererCommunication({
  configStore,
  trackingStore,
  getTrackingActive: () => trackerManager.trackingActive,
  getPreviewActive: () => trackerManager.previewActive,
  getWebcamModelsError: () => trackerManager.webcam.modelsError,
  getWebcamCameraError: () => trackerManager.webcam.cameraError,
  getWebcamExecuteError: () => trackerManager.webcam.executeError,
  getTrackingState: () => trackerManager.state,
});
const overlayCommunication = new OverlayCommunication({
  configStore,
});

configStore.onDidChange('autostart-config', (autostartConfig) => {
  app.setLoginItemSettings({
    openAtLogin: autostartConfig.enabled,
    openAsHidden: autostartConfig.minimise,
    args: [
      '--autostart',
    ],
  });
});
rendererCommunication.on('start-tracking', async () => {
  await trackerManager.startTracking();
});
rendererCommunication.on('pause-tracking', async () => {
  trackerManager.stopTracking();
});
rendererCommunication.on('start-preview', async () => {
  await trackerManager.startPreview();
});
rendererCommunication.on('stop-preview', async () => {
  trackerManager.stopPreview();
});
configStore.onDidChange('overlayAlertsEnabled', (enabled) => {
  if (overlayWin === null) return;
  if (enabled) {
    overlayCommunication.setTouching(overlayWin, trackerManager.touchEvent !== null);
  } else {
    overlayCommunication.setTouching(overlayWin, false);
  }
});
configStore.onDidChange('shortcutEnabled', (enabled) => {
  if (overlayWin !== null) overlayCommunication.setShortcutEnabled(overlayWin, enabled);
});
rendererCommunication.on('open-user-data', () => {
  shell.openPath(app.getPath('userData'));
});

trackingStore.onDidChange('touches', (touches) => {
  if (win !== null) rendererCommunication.setTouches(win, touches);
});
trackingStore.onDidChange('activeTimes', (activeTimes) => {
  if (win !== null) rendererCommunication.setActiveTimes(win, activeTimes);
});
trackingStore.onDidChange('lastActiveTime.startTimestamp', (startTimestamp) => {
  if (win !== null) rendererCommunication.setLastActiveStart(win, startTimestamp || null);
});

trackerManager.on('preview-update', (args) => {
  if (win !== null) rendererCommunication.updatePreview(win, args);
});
trackerManager.on('skeleton-update', (args) => {
  if (win !== null) rendererCommunication.updateSkeleton(win, args);
});
trackerManager.on('webcam-data-update', (data) => {
  if (win !== null) rendererCommunication.updateWebcamData(win, data);
});
trackerManager.on('touching-update', (touching) => {
  if (win !== null) rendererCommunication.setTouchingPreview(win, touching);
});
trackerManager.on('touch-event-update', (touchEvent) => {
  if (overlayWin !== null) overlayCommunication.setTouching(overlayWin, touchEvent);
});
trackerManager.on('ding', () => {
  if (overlayWin !== null) overlayCommunication.ding(overlayWin);
});
trackerManager.webcam.on('models-error', (error) => {
  if (win !== null) rendererCommunication.setWebcamModelsError(win, error);
});
trackerManager.webcam.on('camera-error', (error) => {
  if (win !== null) rendererCommunication.setWebcamCameraError(win, error);
});
trackerManager.webcam.on('execute-error', (error) => {
  if (win !== null) rendererCommunication.setWebcamExecuteError(win, error);
});
trackerManager.on('state-update', (state) => {
  if (win !== null) rendererCommunication.setTrackingState(win, state);
});

// Used to prevent webcam device id change
app.commandLine.appendSwitch('persist-user-preferences');

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    minWidth: 550,
    width: 1000,
    height: 680,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration
      // for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'rendererPreload.js'),
      webSecurity: false,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }

  win.on('closed', () => {
    win = null;
    trackerManager.stopPreview();
  });

  Menu.setApplicationMenu(null);
}

app.whenReady().then(() => {
  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = decodeURI(request.url.replace('file:///', ''));
    callback(pathname);
  });
  protocol.registerFileProtocol('static', (request, callback) => {
    const pathname = decodeURI(request.url.replace('static://', ''));
    const absolutePath = path.join(__static, pathname);
    // eslint-disable-next-line standard/no-callback-literal
    callback({
      path: absolutePath,
    });
  });
});

function createTray() {
  tray = new Tray(nativeImage.createFromPath(path.join(__static, 'icon-32.png'))); // TODO: add proper icon
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Source code on GitHub',
      type: 'normal',
      click() { shell.openExternal('https://github.com/doteq/faceshield'); },
    },
    {
      type: 'separator',
    },
    {
      label: 'Quit Face Shield',
      type: 'normal',
      role: 'quit',
    },
  ]);
  tray.setToolTip(isDevelopment ? 'Face Shield development' : `Face Shield v${app.getVersion()}`);
  tray.setContextMenu(contextMenu);
  tray.addListener('click', () => {
    if (win === null) {
      createWindow();
    } else {
      win.focus();
    }
  });
}

function createOverlayWindow() {
  overlayWin = new BrowserWindow({
    frame: false,
    transparent: true,
    fullscreen: true,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration
      // for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'overlayPreload.js'),
    },
  });
  overlayWin.loadFile(path.join(__static, 'overlay.html')); // TODO: Check if needed
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    overlayWin.loadURL(new URL('/overlay.html', process.env.WEBPACK_DEV_SERVER_URL).toString());
  } else {
    createProtocol('app');
    overlayWin.loadURL('app://./overlay.html');
  }
  overlayWin.setAlwaysOnTop(true, 'status');
  overlayWin.setIgnoreMouseEvents(true);
  overlayWin.setSkipTaskbar(true);
}

app.on('second-instance', () => {
  if (win === null) createWindow();
  else win.focus();
});

const instanceLock = app.requestSingleInstanceLock();
if (instanceLock) {
  app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
      try {
        await installExtension(VUEJS_DEVTOOLS);
        console.log('Installed Vue Devtools');
      } catch (e) {
        console.error('Vue Devtools failed to install:', e.toString());
      }
    }

    createTray();

    const loginItemSettings = app.getLoginItemSettings({
      args: [
        '--autostart',
      ],
    });
    if (process.platform === 'darwin') configStore.set('autostart.minimise', loginItemSettings.openAsHidden);
    if (argv.autostart) {
      if (configStore.get('autostart.startTracking')) {
        await trackerManager.startTracking();
      }
      if (!configStore.get('autostart.minimise')) createWindow();
    } else {
      createWindow();
    }

    createOverlayWindow();

    globalShortcut.register('CommandOrControl+Alt+F', () => {
      if (configStore.get('shortcutEnabled')) trackerManager.removeLastTouch();
    });
  });
} else {
  app.quit();
}

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
