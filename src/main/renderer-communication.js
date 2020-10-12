import { ipcMain } from 'electron';

export default class RendererCommunication {
    constructor(store) {
        this.store = store;
        ipcMain.handle('get-autostart-config', () => {
           return this.store.get('autostart');
        });
        ipcMain.on('set-autostart-config', (event, config) => {
            this.store.set('autostart', config);
            event.sender.send('autostart-config-changed', config);
        });
    }
}
