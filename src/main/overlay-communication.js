export default class OverlayCommunication {
  static setTouching(win, touching) {
    win.webContents.send('overlay:set-touching', touching);
  }

  static ding(win) {
    win.webContents.send('overlay:ding');
  }
}
