<template>
  <v-card
    outlined
    class="control-tile"
  >
    <v-skeleton-loader
      v-if="active === null"
      type="image"
      tile
      height="52"
    />
    <v-sheet
      v-else
      class="px-4 py-2 d-flex align-center"
      :color="`${active ? 'green' : 'red'} white--text`"
    >
      {{ active ? 'Tracking is active' : 'Tracking is paused' }}
      <v-spacer />
      <v-btn
        v-if="active"
        @click="pauseTracking"
      >
        Pause
      </v-btn>
      <v-btn
        v-else
        @click="startTracking"
      >
        Start
      </v-btn>
    </v-sheet>
    <v-expand-transition>
      <div v-if="active === true">
        <div
          v-if="state === 'no-camera'"
          class="px-4 py-3 d-flex align-center"
        >
          <v-icon
            left
            color="red"
          >
            mdi-camera-off
          </v-icon>
          Camera not connected
          <v-spacer />
        </div>
        <div
          v-else-if="state === 'face-not-detected'"
          class="px-4 py-3 d-flex align-center"
        >
          <v-icon
            left
            color="amber darken-1"
          >
            mdi-account-off
          </v-icon>
          Face not detected
        </div>
        <div
          v-else-if="state === 'not-touching'"
          class="px-4 py-3 d-flex align-center"
        >
          <v-icon
            left
            color="green"
          >
            mdi-emoticon
          </v-icon>
          Not touching
        </div>
        <div
          v-else
          class="px-4 py-3 d-flex align-center red--text"
        >
          <v-icon
            left
            color="red"
          >
            mdi-alert-box
          </v-icon>
          Touching detected
        </div>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
  export default {
    data: () => ({
      state: 'face-not-detected',
    }),
    computed: {
      active() {
        return this.$store.state.trackingActive;
      },
    },
    created() {
      setInterval(this.randomiseState, 1500);
    },
    methods: {
      randomiseState() {
        this.state = ['no-camera', 'face-not-detected', 'not-touching', 'touching'][Math.floor(Math.random() * 4)];
      },
      startTracking() {
        this.$comm.startTracking();
      },
      pauseTracking() {
        this.$comm.pauseTracking();
      },
    },
  };
</script>
