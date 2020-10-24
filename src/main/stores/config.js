import Store from 'electron-store';

const schema = {
  additionalProperties: false,
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
  overlayAlertsEnabled: {
    type: 'boolean',
  },
  alertVolume: {
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
  overlayAlertsEnabled: true,
  alertVolume: 1,
};

const configStore = new Store({
  schema,
  defaults,
  name: 'config',
});

export default configStore;
