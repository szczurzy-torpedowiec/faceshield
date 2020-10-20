import { BrowserWindow, ipcMain } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import { EventEmitter } from 'events';

class Webcam extends EventEmitter {
  constructor(options) {
    super();
    this.store = options.store;
    this.window = null;
  }

  async start() {
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
    ipcMain.handle('webcam:get-input-device-id', () => {
      const videoInput = this.store.get('videoInput');
      if (videoInput === null) return null;
      return videoInput.deviceId;
    });
    ipcMain.handle('webcam:get-use-cpu-backend', () => this.store.get('useCpuBackend'));
    ipcMain.handle('webcam:get-frame-wait', () => this.store.get('webcamFrameWait'));
  }

  stop() {
    this.window.close();
    this.window = null;
  }

  setInputDeviceId(deviceId) {
    if (this.window === null) return;
    this.window.webContents.send('webcam:input-device-id-changed', deviceId);
  }

  setUseCpuBackend(useCpuBackend) {
    if (this.window === null) return;
    this.window.webContents.send('webcam:use-cpu-backend-changed', useCpuBackend);
  }

  setFrameWait(wait) {
    this.window.webContents.send('webcam:frame-wait-changed', wait);
  }
}

export default Webcam;
