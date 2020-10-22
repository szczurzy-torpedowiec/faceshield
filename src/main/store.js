import Store from 'electron-store';

const schema = {
  autostart: {
    type: 'object',
    properties: {
      enabled: {
        type: 'boolean',
      },
      startTracking: {
        type: 'boolean',
      },
      minimise: {
        type: 'boolean',
      },
    },
  },
  videoInputLabel: {
    anyOf: [
      {
        type: 'null',
      },
      {
        type: 'string',
      },
    ],
  },
  tracker: {
    type: 'string',
    enum: ['kinect', 'webcam'],
  },
  useCpuBackend: {
    type: 'boolean',
  },
  webcamFrameWait: {
    type: 'number',
  },
};

const defaults = {
  autostart: {
    enabled: false,
    startTracking: true,
    minimise: false,
  },
  videoInputLabel: null,
  tracker: 'webcam',
  useCpuBackend: false,
  webcamFrameWait: 0,
};

const store = new Store({
  schema,
  defaults,
});

export default store;
