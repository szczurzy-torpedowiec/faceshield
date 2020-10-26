import { ipcMain } from 'electron';

export default class OverlayCommunication {
  constructor(options) {
    this.configStore = options.configStore;
    ipcMain.handle('overlay:get-shortcut-enabled', () => this.configStore.get('shortcutEnabled'));
  }

  setTouching(win, touching) {
    const alertsEnabled = this.configStore.get('overlayAlertsEnabled');
    win.webContents.send('overlay:set-touching', touching && alertsEnabled);
  }

  ding(win) {
    const volume = this.configStore.get('alertVolume');
    if (volume === 0) return;
    win.webContents.send('overlay:ding', { volume });
  }

  setShortcutEnabled(win, enabled) {
    win.webContents.send('overlay:shortcut-enabled-changed', enabled);
  }
}
