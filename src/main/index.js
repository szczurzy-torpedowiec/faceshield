/* global __static */

import {
  app, protocol, BrowserWindow, Menu, Tray, nativeImage, shell,
} from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import path from 'path';
import parseArgs from 'minimist';
import store from './store';
import RendererCommunication from './renderer-communication';
import OverlayCommunication from './overlay-communication';
import Webcam from './webcam';
import Tracker from './tracker';

const argv = parseArgs(process.argv.slice(1));
const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = null;
let overlayWin = null;
let tray = null;

let trackingActive = false;

const webcam = new Webcam({
  store,
});

const rendererCommunication = new RendererCommunication({
  store,
  getTrackingActive: () => trackingActive,
});
// TODO: Sprawdzanie nazwy trackera
const tracker = new Tracker('kinect');
rendererCommunication.on('autostart-config-changed', (config) => {
  app.setLoginItemSettings({
    openAtLogin: config.enabled,
    openAsHidden: config.minimise,
    args: [
      '--autostart',
    ],
  });
});
rendererCommunication.on('start-tracking', () => {
  trackingActive = true;
  tracker.connect();
});
rendererCommunication.on('pause-tracking', () => {
  trackingActive = false;
  tracker.disconnect();
});
rendererCommunication.on('video-input-changed', (videoInput) => {
  webcam.setInputDeviceId(videoInput === null ? null : videoInput.deviceId);
});
rendererCommunication.on('use-cpu-backend-changed', (useCpuBackend) => {
  webcam.setUseCpuBackend(useCpuBackend);
});
rendererCommunication.on('webcam-frame-wait-changed', (wait) => {
  webcam.setFrameWait(wait);
});

// const overlayCommunication = new OverlayCommunication();

tracker.on('preview-update', (args) => {
  if (win !== null) rendererCommunication.updatePreview(win, args);
});

tracker.on('skeleton-update', (args) => {
  if (win !== null) rendererCommunication.updateSkeleton(win, args);
});

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
  });
}

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
  tray.setToolTip('Face Shield');
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
      // Install Vue Devtools
      try {
        await installExtension(VUEJS_DEVTOOLS);
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
    if (process.platform === 'darwin') store.set('autostart.minimise', loginItemSettings.openAsHidden);
    if (argv.autostart) {
      if (store.get('autostart.startTracking')) {
        trackingActive = true;
        // TODO: Start tracking
      }
      if (!store.get('autostart.minimise')) createWindow();
    } else {
      createWindow();
    }

    createOverlayWindow();
    await webcam.start();
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
