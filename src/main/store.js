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
};

const defaults = {
  autostart: {
    enabled: false,
    startTracking: true,
    minimise: false,
  },
};

const store = new Store({
  schema,
  defaults,
});

export default store;
