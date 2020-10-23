class CommunicationPlugin {
  async init() {
    const autostartConfig = await window.ipcRenderer.invoke('get-autostart-config');
    this.store.commit('setAutostartConfig', autostartConfig);

    const trackingActive = await window.ipcRenderer.invoke('get-tracking-active');
    this.store.commit('setTrackingActive', trackingActive);

    const previewActive = await window.ipcRenderer.invoke('get-preview-active');
    this.store.commit('setPreviewActive', previewActive);

    const videoInputLabel = await window.ipcRenderer.invoke('get-video-input-label');
    this.store.commit('setVideoInputLabel', videoInputLabel);

    const useCpuBackend = await window.ipcRenderer.invoke('get-use-cpu-backend');
    this.store.commit('setUseCpuBackend', useCpuBackend);

    const webcamFrameWait = await window.ipcRenderer.invoke('get-webcam-frame-wait');
    this.store.commit('setWebcamFrameWait', webcamFrameWait);

    const tracker = await window.ipcRenderer.invoke('get-tracker');
    this.store.commit('setTracker', tracker);

    const webcamModelsError = await window.ipcRenderer.invoke('get-webcam-models-error');
    this.store.commit('setWebcamModelsError', webcamModelsError);

    const webcamCameraError = await window.ipcRenderer.invoke('get-webcam-camera-error');
    this.store.commit('setWebcamCameraError', webcamCameraError);

    const webcamExecuteError = await window.ipcRenderer.invoke('get-webcam-execute-error');
    this.store.commit('setWebcamExecuteError', webcamExecuteError);

    const alertVolume = await window.ipcRenderer.invoke('get-alert-volume');
    this.store.commit('setAlertVolume', alertVolume);
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

  startPreview() {
    window.ipcRenderer.send('start-preview');
  }

  stopPreview() {
    window.ipcRenderer.send('stop-preview');
  }

  setVideoInputLabel(label) {
    window.ipcRenderer.send('set-video-input-label', label);
  }

  setUseCpuBackend(useCpuBackend) {
    window.ipcRenderer.send('set-use-cpu-backend', useCpuBackend);
  }

  setWebcamFrameWait(webcamFrameWait) {
    window.ipcRenderer.send('set-webcam-frame-wait', webcamFrameWait);
  }

  setTracker(tracker) {
    window.ipcRenderer.send('set-tracker', tracker);
  }

  setAlertVolume(tracker) {
    window.ipcRenderer.send('set-alert-volume', tracker);
  }

  async install(Vue, options) {
    this.store = options.store;
    window.ipcRenderer.on('autostart-config-changed', (event, config) => {
      this.store.commit('setAutostartConfig', config);
    });
    window.ipcRenderer.on('tracking-active-changed', (event, active) => {
      this.store.commit('setTrackingActive', active);
    });
    window.ipcRenderer.on('preview-active-changed', (event, active) => {
      this.store.commit('setPreviewActive', active);
    });
    window.ipcRenderer.on('video-input-label-changed', (event, label) => {
      this.store.commit('setVideoInputLabel', label);
    });
    window.ipcRenderer.on('use-cpu-backend-changed', (event, useCpuBackend) => {
      this.store.commit('setUseCpuBackend', useCpuBackend);
    });
    window.ipcRenderer.on('webcam-frame-wait-changed', (event, webcamFrameWait) => {
      this.store.commit('setWebcamFrameWait', webcamFrameWait);
    });
    window.ipcRenderer.on('tracker-changed', (event, tracker) => {
      this.store.commit('setTracker', tracker);
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
    window.ipcRenderer.on('alert-volume-changed', (event, volume) => {
      this.store.commit('setAlertVolume', volume);
    });

    await this.init();
    Vue.prototype.$comm = {
      setAutostartConfig: this.setAutostartConfig,
      startTracking: this.startTracking,
      pauseTracking: this.pauseTracking,
      startPreview: this.startPreview,
      stopPreview: this.stopPreview,
      setVideoInputLabel: this.setVideoInputLabel,
      setUseCpuBackend: this.setUseCpuBackend,
      setWebcamFrameWait: this.setWebcamFrameWait,
      setTracker: this.setTracker,
      setAlertVolume: this.setAlertVolume,
    };
  }
}

const plugin = new CommunicationPlugin();

export default plugin;
