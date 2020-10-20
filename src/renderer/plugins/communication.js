class CommunicationPlugin {
  async init() {
    const autostartConfig = await window.ipcRenderer.invoke('get-autostart-config');
    this.store.commit('setAutostartConfig', autostartConfig);

    const trackingActive = await window.ipcRenderer.invoke('get-tracking-active');
    this.store.commit('setTrackingActive', trackingActive);

    const videoInput = await window.ipcRenderer.invoke('get-video-input');
    this.store.commit('setVideoInput', videoInput);

    const useCpuBackend = await window.ipcRenderer.invoke('get-use-cpu-backend');
    this.store.commit('setUseCpuBackend', useCpuBackend);

    const webcamFrameWait = await window.ipcRenderer.invoke('get-webcam-frame-wait');
    this.store.commit('setWebcamFrameWait', webcamFrameWait);
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

  setVideoInput(videoInput) {
    window.ipcRenderer.send('set-video-input', videoInput);
  }

  setUseCpuBackend(useCpuBackend) {
    window.ipcRenderer.send('set-use-cpu-backend', useCpuBackend);
  }

  setWebcamFrameWait(webcamFrameWait) {
    window.ipcRenderer.send('set-webcam-frame-wait', webcamFrameWait);
  }

  async install(Vue, options) {
    this.store = options.store;
    window.ipcRenderer.on('autostart-config-changed', (event, config) => {
      this.store.commit('setAutostartConfig', config);
    });
    window.ipcRenderer.on('tracking-active-changed', (event, active) => {
      this.store.commit('setTrackingActive', active);
    });
    window.ipcRenderer.on('video-input-changed', (event, videoInput) => {
      this.store.commit('setVideoInput', videoInput);
    });
    window.ipcRenderer.on('use-cpu-backend-changed', (event, useCpuBackend) => {
      this.store.commit('setUseCpuBackend', useCpuBackend);
    });
    window.ipcRenderer.on('webcam-frame-wait-changed', (event, webcamFrameWait) => {
      this.store.commit('setWebcamFrameWait', webcamFrameWait);
    });

    await this.init();
    Vue.prototype.$comm = {
      setAutostartConfig: this.setAutostartConfig,
      startTracking: this.startTracking,
      pauseTracking: this.pauseTracking,
      setVideoInput: this.setVideoInput,
      setUseCpuBackend: this.setUseCpuBackend,
      setWebcamFrameWait: this.setWebcamFrameWait,
    };
  }
}

const plugin = new CommunicationPlugin();

export default plugin;
