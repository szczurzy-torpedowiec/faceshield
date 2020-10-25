import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    config: null,
    trackingActive: null,
    previewActive: null,
    webcamModelsError: null,
    webcamCameraError: null,
    webcamExecuteError: null,
    trackingState: null,
    touches: null,
    activeTimes: null,
  },
  mutations: {
    setConfig(state, config) {
      state.config = config;
    },
    setConfigItem(state, { path, value }) {
      _.set(state.config, path, value);
    },
    setTrackingActive(state, active) {
      state.trackingActive = active;
    },
    setPreviewActive(state, active) {
      state.previewActive = active;
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
    setTrackingState(state, trackingState) {
      state.trackingState = trackingState;
    },
    setTouches(state, touches) {
      state.touches = touches;
    },
    setActiveTimes(state, activeTimes) {
      state.activeTimes = activeTimes;
    },
  },
  actions: {
  },
  modules: {
  },
});
