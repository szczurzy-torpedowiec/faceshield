class CommunicationPlugin {
  async init() {
    const config = await window.ipcRenderer.invoke('get-config');
    this.store.commit('setConfig', config);

    const trackingActive = await window.ipcRenderer.invoke('get-tracking-active');
    this.store.commit('setTrackingActive', trackingActive);

    const previewActive = await window.ipcRenderer.invoke('get-preview-active');
    this.store.commit('setPreviewActive', previewActive);

    const webcamModelsError = await window.ipcRenderer.invoke('get-webcam-models-error');
    this.store.commit('setWebcamModelsError', webcamModelsError);

    const webcamCameraError = await window.ipcRenderer.invoke('get-webcam-camera-error');
    this.store.commit('setWebcamCameraError', webcamCameraError);

    const webcamExecuteError = await window.ipcRenderer.invoke('get-webcam-execute-error');
    this.store.commit('setWebcamExecuteError', webcamExecuteError);
  }

  setConfigItem(path, value) {
    window.ipcRenderer.send('set-config-item', path, value);
  }

  startTracking() {
    window.ipcRenderer.send('start-tracking');
  }

  pauseTracking() {
    window.ipcRenderer.send('pause-tracking');
  }

  startPreview() {
    window.ipcRenderer.send('start-preview');
  }

  stopPreview() {
    window.ipcRenderer.send('stop-preview');
  }

  openUserData() {
    window.ipcRenderer.send('open-user-data');
  }

  async install(Vue, options) {
    this.store = options.store;
    window.ipcRenderer.on('config-item-changed', (event, path, value) => {
      this.store.commit('setConfigItem', { path, value });
    });
    window.ipcRenderer.on('tracking-active-changed', (event, active) => {
      this.store.commit('setTrackingActive', active);
    });
    window.ipcRenderer.on('preview-active-changed', (event, active) => {
      this.store.commit('setPreviewActive', active);
    });
    window.ipcRenderer.on('webcam-models-error-changed', (event, error) => {
      this.store.commit('setWebcamModelsError', error);
    });
    window.ipcRenderer.on('webcam-camera-error-changed', (event, error) => {
      this.store.commit('setWebcamCameraError', error);
    });
    window.ipcRenderer.on('webcam-execute-error-changed', (event, error) => {
      this.store.commit('setWebcamExecuteError', error);
    });

    await this.init();
    Vue.prototype.$comm = {
      setConfigItem: this.setConfigItem,
      startTracking: this.startTracking,
      pauseTracking: this.pauseTracking,
      startPreview: this.startPreview,
      stopPreview: this.stopPreview,
      openUserData: this.openUserData,
    };
  }
}

const plugin = new CommunicationPlugin();

export default plugin;
