import Store from 'electron-store';

const isDevelopment = process.env.NODE_ENV !== 'production';

const schema = {
  autostart: {
    type: 'object',
    properties: {
      enabled: isDevelopment ? {
        const: false,
      } : {
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
  saveGifs: {
    type: 'boolean',
  },
  darkTheme: {
    type: 'boolean',
  },
  recentTouchesTilePeriod: {
    type: 'number',
  },
  touchesPerHourTilePeriod: {
    type: 'number',
  },
  shortcutEnabled: {
    type: 'boolean',
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
  saveGifs: true,
  darkTheme: false,
  recentTouchesTilePeriod: 1,
  touchesPerHourTilePeriod: 24,
  shortcutEnabled: true,
};

export default function createConfigStore(path) {
  return new Store({
    schema,
    defaults,
    name: 'config',
    cwd: path,
  });
}
