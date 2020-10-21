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
  }

  updatePreview(win, string) {
    win.webContents.send('update-preview', string);
  }

  updateSkeleton(win, string) {
    win.webContents.send('update-skeleton', string);
  }
}
