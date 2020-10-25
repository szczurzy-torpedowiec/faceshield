import { ipcMain } from 'electron';
import { EventEmitter } from 'events';

export default class RendererCommunication extends EventEmitter {
  constructor(options) {
    super();
    this.configStore = options.configStore;
    this.trackingStore = options.trackingStore;
    this.getTrackingState = options.getTrackingState;
    this.getTrackingActive = options.getTrackingActive;
    this.getPreviewActive = options.getPreviewActive;
    this.getWebcamModelsError = options.getWebcamModelsError;
    this.getWebcamCameraError = options.getWebcamCameraError;
    this.getWebcamExecuteError = options.getWebcamExecuteError;

    ipcMain.handle('get-config', () => this.configStore.store);
    ipcMain.on('set-config-item', (event, path, value) => {
      this.configStore.set(path, value);
      event.sender.send('config-item-changed', path, value);
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

    ipcMain.handle('get-webcam-models-error', () => this.getWebcamModelsError());
    ipcMain.handle('get-webcam-camera-error', () => this.getWebcamCameraError());
    ipcMain.handle('get-webcam-execute-error', () => this.getWebcamExecuteError());

    ipcMain.handle('get-tracking-state', () => this.getTrackingState());

    ipcMain.handle('get-touches', () => this.trackingStore.get('touches'));
    ipcMain.handle('get-active-times', () => this.trackingStore.get('activeTimes'));

    ipcMain.handle('get-last-active-start', () => this.trackingStore.get('lastActiveTime.startTimestamp') || null);

    ipcMain.on('open-user-data', () => this.emit('open-user-data'));
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

  setTrackingState(win, trackingState) {
    win.webContents.send('tracking-state-changed', trackingState);
  }

  setTouchingPreview(win, touching) {
    win.webContents.send('set-touching-preview', touching);
  }

  setTouches(win, touches) {
    win.webContents.send('touches-changed', touches);
  }

  setActiveTimes(win, activeTimes) {
    win.webContents.send('active-times-changed', activeTimes);
  }

  setLastActiveStart(win, startTimestamp) {
    win.webContents.emit('last-active-start-changed', startTimestamp);
  }
}
