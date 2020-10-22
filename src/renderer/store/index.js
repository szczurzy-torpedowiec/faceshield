import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    autostartConfig: null,
    trackingActive: null,
    previewActive: null,
    videoInputLoaded: false,
    videoInputLabel: null,
    useCpuBackend: null,
    webcamFrameWait: null,
    tracker: null,
    webcamModelsError: null,
    webcamCameraError: null,
    webcamExecuteError: null,
  },
  mutations: {
    setAutostartConfig(state, config) {
      state.autostartConfig = config;
    },
    setTrackingActive(state, active) {
      state.trackingActive = active;
    },
    setPreviewActive(state, active) {
      state.previewActive = active;
    },
    setVideoInputLabel(state, label) {
      state.videoInputLoaded = true;
      state.videoInputLabel = label;
    },
    setUseCpuBackend(state, useCpuBackend) {
      state.useCpuBackend = useCpuBackend;
    },
    setWebcamFrameWait(state, webcamFrameWait) {
      state.webcamFrameWait = webcamFrameWait;
    },
    setTracker(state, tracker) {
      state.tracker = tracker;
    },
    setWebcamModelsError(state, error) {
      state.webcamModelsError = error;
    },
    setWebcamCameraError(state, error) {
      state.webcamCameraError = error;
    },
    setWebcamExecuteError(state, error) {
      state.webcamExecuteError = error;
    },
  },
  actions: {
  },
  modules: {
  },
});
