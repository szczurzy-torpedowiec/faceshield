import Store from 'electron-store';

const schema = {
  touches: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        timestamp: {
          type: 'number',
        },
        gifPath: {
          listOf: [
            {
              type: 'string',
            },
            {
              type: 'null',
            },
          ],
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
  touches: [],
  activeTimes: [],
  lastActiveTime: null,
};

export default function createTrackingStore(path) {
  return new Store({
    schema,
    defaults,
    name: 'tracking',
    cwd: path,
  });
}
