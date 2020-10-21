import { BrowserWindow, ipcMain } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import { EventEmitter } from 'events';

class Webcam extends EventEmitter {
  constructor(options) {
    super();
    this.store = options.store;
    this.window = null;

    ipcMain.handle('webcam:get-video-input-label', () => this.store.get('videoInputLabel'));
    ipcMain.handle('webcam:get-use-cpu-backend', () => this.store.get('useCpuBackend'));
    ipcMain.handle('webcam:get-frame-wait', () => this.store.get('webcamFrameWait'));

    ipcMain.on('webcam:data', (event, data) => this.emit('data-update', data));
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
  }

  stop() {
    this.window.close();
    this.window = null;
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
    this.window.webContents.send('webcam:frame-wait-changed', wait);
  }
}

export default Webcam;
