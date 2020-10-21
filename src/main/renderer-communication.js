import { ipcMain } from 'electron';
import { EventEmitter } from 'events';

export default class RendererCommunication extends EventEmitter {
  constructor(options) {
    super();
    this.store = options.store;
    this.getTrackingActive = options.getTrackingActive;

    ipcMain.handle('get-autostart-config', () => this.store.get('autostart'));
    ipcMain.on('set-autostart-config', (event, config) => {
      this.store.set('autostart', config);
      event.sender.send('autostart-config-changed', config);
      this.emit('autostart-config-changed', config);
    });

    ipcMain.handle('get-tracking-active', () => this.getTrackingActive());
    ipcMain.on('start-tracking', (event) => {
      event.sender.send('tracking-active-changed', true);
      this.emit('start-tracking');
    });
    ipcMain.on('pause-tracking', (event) => {
      event.sender.send('tracking-active-changed', false);
      this.emit('pause-tracking');
    });

    ipcMain.handle('get-video-input', () => this.store.get('videoInput'));
    ipcMain.on('set-video-input', (event, videoInput) => {
      this.store.set('videoInput', videoInput);
      event.sender.send('video-input-changed', videoInput);
      this.emit('video-input-changed', videoInput);
    });

    ipcMain.handle('get-use-cpu-backend', () => this.store.get('useCpuBackend'));
    ipcMain.on('set-use-cpu-backend', (event, useCpuBackend) => {
      this.store.set('useCpuBackend', useCpuBackend);
      event.sender.send('use-cpu-backend-changed', useCpuBackend);
      this.emit('use-cpu-backend-changed', useCpuBackend);
    });

    ipcMain.handle('get-webcam-frame-wait', () => this.store.get('webcamFrameWait'));
    ipcMain.on('set-webcam-frame-wait', (event, webcamFrameWait) => {
      this.store.set('webcamFrameWait', webcamFrameWait);
      event.sender.send('webcam-frame-wait-changed', webcamFrameWait);
      this.emit('webcam-frame-wait-changed', webcamFrameWait);
    });
  }

  updatePreview(win, string) {
    win.webContents.send('update-preview', string);
  }

  updateSkeleton(win, string) {
    win.webContents.send('update-skeleton', string);
  }
}
