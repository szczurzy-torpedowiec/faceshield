import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    autostartConfig: null,
    trackingActive: null,
    videoInputLoaded: true,
    videoInput: {
      deviceId: 'disconnected-camera',
      label: 'Label of the disCam',
    },
    useCpuBackend: null,
    webcamFrameWait: null,
  },
  mutations: {
    setAutostartConfig(state, config) {
      state.autostartConfig = config;
    },
    setTrackingActive(state, trackingActive) {
      state.trackingActive = trackingActive;
    },
    setVideoInput(state, videoInput) {
      state.videoInputLoaded = true;
      state.videoInput = videoInput;
    },
    setUseCpuBackend(state, useCpuBackend) {
      state.useCpuBackend = useCpuBackend;
    },
    setWebcamFrameWait(state, webcamFrameWait) {
      state.webcamFrameWait = webcamFrameWait;
    },
  },
  actions: {
  },
  modules: {
  },
});
