<template>
  <v-card outlined class="control-tile">
    <v-skeleton-loader type="image" tile height="52" v-if="active === null" />
    <v-sheet
        class="px-4 py-2 d-flex align-center"
        :color="`${active ? 'green' : 'red'} white--text`"
        v-else
    >
      {{ active ? 'Tracking is active' : 'Tracking is paused' }}
      <v-spacer />
      <v-btn @click="pauseTracking" v-if="active">Pause</v-btn>
      <v-btn @click="startTracking" v-else>Start</v-btn>
    </v-sheet>
    <v-expand-transition>
      <div v-if="active === true">
        <div class="px-4 py-3 d-flex align-center" v-if="state === 'no-camera'">
          <v-icon left color="red">mdi-camera-off</v-icon>
          Camera not connected
          <v-spacer />
        </div>
        <div class="px-4 py-3 d-flex align-center" v-else-if="state === 'face-not-detected'">
          <v-icon left color="amber darken-1">mdi-account-off</v-icon>
          Face not detected
        </div>
        <div class="px-4 py-3 d-flex align-center" v-else-if="state === 'not-touching'">
          <v-icon left color="green">mdi-emoticon</v-icon>
          Not touching
        </div>
        <div class="px-4 py-3 d-flex align-center red--text" v-else>
          <v-icon left color="red">mdi-alert-box</v-icon>
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
    active () {
      return this.$store.state.trackingActive;
    }
  },
  created() {
    setInterval(this.randomiseState, 1500);
  },
  methods: {
    randomiseState() {
      this.state = ['no-camera', 'face-not-detected', 'not-touching', 'touching'][Math.floor(Math.random() * 4)]
    },
    startTracking() {
      this.$comm.startTracking()
    },
    pauseTracking() {
      this.$comm.pauseTracking()
    }
  }
};
</script>
