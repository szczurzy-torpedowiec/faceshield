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
  overlayAlertsEnabled: {
    type: 'boolean',
  },
  alertVolume: {
    type: 'number',
  },
  touches: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        timestamp: {
          type: 'number',
        },
      },
    },
  },
  activeTimes: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        startTimestamp: {
          type: 'number',
        },
        endTimestamp: {
          type: 'number',
        },
        duration: {
          type: 'number',
          description: 'Duration in milliseconds',
        },
      },
    },
  },
  lastActiveTime: {
    anyOf: [
      {
        type: 'null',
      },
      {
        type: 'object',
        properties: {
          startTimestamp: {
            type: 'number',
          },
          endTimestamp: {
            type: 'number',
          },
        },
      },
    ],
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
  touches: [],
  activeTimes: [],
  lastActiveTime: null,
};

const store = new Store({
  schema,
  defaults,
});

export default store;
