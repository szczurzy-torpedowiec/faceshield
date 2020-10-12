<template>
  <v-card outlined class="control-tile">
    <v-sheet
        class="px-4 py-2 d-flex align-center"
        :color="`${active ? 'green' : 'red'} white--text`"
    >
      {{ active ? 'Tracking is active' : 'Tracking is paused' }}
      <v-spacer />
      <v-btn @click="active = false" v-if="active">Pause</v-btn>
      <v-btn @click="active = true" v-else>Start</v-btn>
    </v-sheet>
    <v-expand-transition>
      <div v-if="active">
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
    active: true,
    state: 'face-not-detected',
  }),
  created() {
    setInterval(this.randomiseState, 1500);
  },
  methods: {
    randomiseState() {
      this.state = ['no-camera', 'face-not-detected', 'not-touching', 'touching'][Math.floor(Math.random() * 4)]
    }
  }
};
</script>

<style lang="scss">
  .control-tile {
    grid-area: control;
  }
</style>