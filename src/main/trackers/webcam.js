import { BrowserWindow, ipcMain } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import { EventEmitter } from 'events';

class Webcam extends EventEmitter {
  constructor(options) {
    super();
    this.store = options.store;
    this.window = null;
    this.modelsError = null;
    this.cameraError = null;
    this.executeError = null;

    ipcMain.handle('webcam:get-video-input-label', () => this.store.get('videoInputLabel'));
    ipcMain.handle('webcam:get-use-cpu-backend', () => this.store.get('useCpuBackend'));
    ipcMain.handle('webcam:get-frame-wait', () => this.store.get('webcamFrameWait'));

    ipcMain.on('webcam:data', (event, data) => this.emit('data-update', data));
    ipcMain.on('webcam:models-error', (event, error) => this.setModelsError(error));
    ipcMain.on('webcam:camera-error', (event, error) => this.setCameraError(error));
    ipcMain.on('webcam:execute-error', (event, error) => this.setExecuteError(error));
  }

  async start() {
    this.setModelsError(false);
    this.setCameraError(false);
    this.setExecuteError(false);
    this.window = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
      },
      show: false,
    });
    if (process.env.WEBPACK_DEV_SERVER_URL) {
      this.window.loadURL(new URL('/webcam.html', process.env.WEBPACK_DEV_SERVER_URL).toString());
      if (!process.env.IS_TEST) this.window.webContents.openDevTools();
    } else {
      createProtocol('app');
      this.window.loadURL('app://./webcam.html');
    }
  }

  stop() {
    this.window.close();
    this.window = null;
    this.setModelsError(null);
    this.setCameraError(null);
    this.setExecuteError(null);
  }

  setVideoInputLabel(label) {
    if (this.window === null) return;
    this.window.webContents.send('webcam:video-input-label-changed', label);
  }

  setUseCpuBackend(useCpuBackend) {
    if (this.window === null) return;
    this.window.webContents.send('webcam:use-cpu-backend-changed', useCpuBackend);
  }

  setFrameWait(wait) {
    if (this.window === null) return;
    this.window.webContents.send('webcam:frame-wait-changed', wait);
  }

  setModelsError(error) {
    this.modelsError = error;
    this.emit('models-error', error);
  }

  setCameraError(error) {
    this.cameraError = error;
    this.emit('camera-error', error);
  }

  setExecuteError(error) {
    this.executeError = error;
    this.emit('execute-error', error);
  }
}

export default Webcam;
