import { ipcMain } from 'electron';
import { EventEmitter } from 'events';

export default class RendererCommunication extends EventEmitter {
  constructor(options) {
    super();
    this.configStore = options.configStore;
    this.getTrackingActive = options.getTrackingActive;
    this.getPreviewActive = options.getPreviewActive;
    this.getWebcamModelsError = options.getWebcamModelsError;
    this.getWebcamCameraError = options.getWebcamCameraError;
    this.getWebcamExecuteError = options.getWebcamExecuteError;

    ipcMain.handle('get-autostart-config', () => this.configStore.get('autostart'));
    ipcMain.on('set-autostart-config', (event, autostartConfig) => {
      this.configStore.set('autostart', autostartConfig);
      event.sender.send('autostart-config-changed', autostartConfig);
      this.emit('autostart-config-changed', autostartConfig);
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

    ipcMain.handle('get-preview-active', () => this.getPreviewActive());
    ipcMain.on('start-preview', (event) => {
      event.sender.send('preview-active-changed', true);
      this.emit('start-preview');
    });
    ipcMain.on('stop-preview', (event) => {
      event.sender.send('preview-active-changed', false);
      this.emit('stop-preview');
    });

    ipcMain.handle('get-video-input-label', () => this.configStore.get('videoInputLabel'));
    ipcMain.on('set-video-input-label', (event, label) => {
      this.configStore.set('videoInputLabel', label);
      event.sender.send('video-input-label-changed', label);
      this.emit('video-input-label-changed', label);
    });

    ipcMain.handle('get-use-cpu-backend', () => this.configStore.get('useCpuBackend'));
    ipcMain.on('set-use-cpu-backend', (event, useCpuBackend) => {
      this.configStore.set('useCpuBackend', useCpuBackend);
      event.sender.send('use-cpu-backend-changed', useCpuBackend);
      this.emit('use-cpu-backend-changed', useCpuBackend);
    });

    ipcMain.handle('get-webcam-frame-wait', () => this.configStore.get('webcamFrameWait'));
    ipcMain.on('set-webcam-frame-wait', (event, webcamFrameWait) => {
      this.configStore.set('webcamFrameWait', webcamFrameWait);
      event.sender.send('webcam-frame-wait-changed', webcamFrameWait);
      this.emit('webcam-frame-wait-changed', webcamFrameWait);
    });

    ipcMain.handle('get-tracker', () => this.configStore.get('tracker'));
    ipcMain.on('set-tracker', (event, tracker) => {
      this.configStore.set('tracker', tracker);
      event.sender.send('tracker-changed', tracker);
      this.emit('tracker-changed', tracker);
    });

    ipcMain.handle('get-webcam-models-error', () => this.getWebcamModelsError());
    ipcMain.handle('get-webcam-camera-error', () => this.getWebcamCameraError());
    ipcMain.handle('get-webcam-execute-error', () => this.getWebcamExecuteError());

    ipcMain.handle('get-overlay-alerts-enabled', () => this.configStore.get('overlayAlertsEnabled'));
    ipcMain.on('set-overlay-alerts-enabled', (event, enabled) => {
      this.configStore.set('overlayAlertsEnabled', enabled);
      event.sender.send('overlay-alerts-enabled-changed', enabled);
      this.emit('overlay-alerts-enabled-changed', enabled);
    });

    ipcMain.handle('get-alert-volume', () => this.configStore.get('alertVolume'));
    ipcMain.on('set-alert-volume', (event, volume) => {
      this.configStore.set('alertVolume', volume);
      event.sender.send('alert-volume-changed', volume);
    });
  }

  updatePreview(win, image) {
    win.webContents.send('update-preview', image);
  }

  updateSkeleton(win, skeleton) {
    win.webContents.send('update-skeleton', skeleton);
  }

  updateWebcamData(win, data) {
    win.webContents.send('update-webcam-data', data);
  }

  setWebcamModelsError(win, error) {
    win.webContents.send('webcam-models-error-changed', error);
  }

  setWebcamCameraError(win, error) {
    win.webContents.send('webcam-camera-error-changed', error);
  }

  setWebcamExecuteError(win, error) {
    win.webContents.send('webcam-execute-error-changed', error);
  }

  setTouchingPreview(win, touching) {
    win.webContents.send('set-touching-preview', touching);
  }
}
