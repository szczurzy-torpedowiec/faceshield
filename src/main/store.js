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
    videoInput: {
      anyOf: [
        {
          type: 'null',
        },
        {
          type: 'object',
          properties: {
            deviceId: {
              type: 'string',
            },
            label: {
              type: 'string',
            },
          },
        },
      ],
    },
    useCpuBackend: {
      type: 'boolean',
    },
    webcamFrameWait: {
      type: 'number',
    },
  },
};

const defaults = {
  autostart: {
    enabled: false,
    startTracking: true,
    minimise: false,
  },
  videoInput: null,
  useCpuBackend: false,
  webcamFrameWait: 0,
};

const store = new Store({
  schema,
  defaults,
});

export default store;
