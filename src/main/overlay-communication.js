export default class OverlayCommunication {
  constructor(options) {
    this.configStore = options.configStore;
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
}
