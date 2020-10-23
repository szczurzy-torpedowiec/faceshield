export default class OverlayCommunication {
  constructor(options) {
    this.store = options.store;
  }

  setTouching(win, touching) {
    win.webContents.send('overlay:set-touching', touching);
  }

  ding(win) {
    const volume = this.store.get('alertVolume');
    if (volume === 0) return;
    win.webContents.send('overlay:ding', { volume });
  }
}
