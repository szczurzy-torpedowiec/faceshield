class CommunicationPlugin {
  async init() {
    const autostartConfig = await window.ipcRenderer.invoke('get-autostart-config');
    this.store.commit('setAutostartConfig', autostartConfig);
    const trackingActive = await window.ipcRenderer.invoke('get-tracking-active');
    this.store.commit('setTrackingActive', trackingActive);
  }

  setAutostartConfig(config) {
    window.ipcRenderer.send('set-autostart-config', config);
  }

  startTracking() {
    window.ipcRenderer.send('start-tracking');
  }

  pauseTracking() {
    window.ipcRenderer.send('pause-tracking');
  }

  async install(Vue, options) {
    this.store = options.store;
    window.ipcRenderer.on('autostart-config-changed', (event, config) => {
      this.store.commit('setAutostartConfig', config);
    });
    window.ipcRenderer.on('tracking-active-changed', (event, active) => {
      this.store.commit('setTrackingActive', active);
    });
    await this.init();
    Vue.prototype.$comm = {
      setAutostartConfig: this.setAutostartConfig,
      startTracking: this.startTracking,
      pauseTracking: this.pauseTracking,
    };
  }
}

const plugin = new CommunicationPlugin();

export default plugin;
