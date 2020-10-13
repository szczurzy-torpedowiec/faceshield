import { ipcMain } from 'electron';
import { EventEmitter } from 'events';

export default class RendererCommunication extends EventEmitter {
    constructor(store) {
        super()
        this.store = store;
        ipcMain.handle('get-autostart-config', () => {
           return this.store.get('autostart');
        });
        ipcMain.on('set-autostart-config', (event, config) => {
            this.store.set('autostart', config);
            event.sender.send('autostart-config-changed', config);
            this.emit('autostart-config-changed', config);
        });
    }
}
