import { EventEmitter } from 'events';

export default class OverlayCommunication extends EventEmitter {
    setNotTouching(win) {
        win.webContents.send('set-not-touching');
    }

    setAboutToTouch(win) {
        win.webContents.send('set-about-to-touch');
    }

    setTouching(win) {
        win.webContents.send('set-touching');
    }
}
