class CommunicationPlugin {
    async init () {
        const autostartConfig = await window.ipcRenderer.invoke('get-autostart-config');
        this.store.commit('setAutostartConfig', autostartConfig);
    }

    setAutostartConfig (config) {
        window.ipcRenderer.send('set-autostart-config', config);
    }

    async install (Vue, options) {
        this.store = options.store;
        window.ipcRenderer.on('autostart-config-changed', (event, config) => {
            this.store.commit('setAutostartConfig', config);
        })
        await this.init();
        Vue.prototype.$comm = {
            setAutostartConfig: this.setAutostartConfig,
        };
    }
}

const plugin = new CommunicationPlugin();

export default plugin;
