export default class OverlayCommunication {
  constructor(options) {
    this.store = options.store;
  }

  setTouching(win, touching) {
    const alertsEnabled = this.store.get('overlayAlertsEnabled');
    win.webContents.send('overlay:set-touching', touching && alertsEnabled);
  }

  ding(win) {
    const volume = this.store.get('alertVolume');
    if (volume === 0) return;
    win.webContents.send('overlay:ding', { volume });
  }
}
