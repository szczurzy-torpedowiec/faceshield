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
        light
        @click="pauseTracking"
      >
        Pause
      </v-btn>
      <v-btn
        v-else
        light
        @click="startTracking"
      >
        Start
      </v-btn>
    </v-sheet>
    <v-expand-transition>
      <div v-if="active === true && trackingState !== null">
        <v-alert
          v-if="trackingState === 'tracker-loading'"
          tile
          class="mb-0"
        >
          <template #prepend>
            <v-progress-circular
              indeterminate
              class="mr-4"
              color="primary"
              :size="24"
              :width="2"
            />
          </template>
          Tracker loading
        </v-alert>
        <v-alert
          v-else-if="trackingState === 'tracker-error'"
          icon="mdi-alert-circle"
          color="red"
          tile
          text
          class="mb-0"
        >
          Tracking error
        </v-alert>
        <v-alert
          v-else-if="trackingState === 'face-not-detected'"
          icon="mdi-face"
          color="amber darken-2"
          tile
          text
          class="mb-0"
        >
          Face not detected
        </v-alert>
        <v-alert
          v-else-if="trackingState === 'not-touching'"
          icon="mdi-emoticon"
          tile
          class="mb-0"
        >
          Not touching face
        </v-alert>
        <v-alert
          v-else-if="trackingState === 'touching'"
          icon="mdi-emoticon-sad"
          tile
          color="deep-orange"
          text
          class="mb-0"
        >
          Touching face!
        </v-alert>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
  export default {
    computed: {
      active() {
        return this.$store.state.trackingActive;
      },
      trackingState() {
        return this.$store.state.trackingState;
      },
    },
    methods: {
      startTracking() {
        this.$comm.startTracking();
      },
      pauseTracking() {
        this.$comm.pauseTracking();
      },
    },
  };
</script>
