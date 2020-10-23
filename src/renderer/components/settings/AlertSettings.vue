<template>
  <v-card outlined>
    <v-card-title>
      Alerts
    </v-card-title>
    <v-list>
      <v-list-item link>
        <v-list-item-title>
          Show alerts overlay
        </v-list-item-title>
        <v-list-item-action>
          <v-switch
            :input-value="false"
            readonly
          />
        </v-list-item-action>
      </v-list-item>
      <v-list-item
        class="d-block"
      >
        <div class="d-flex align-center">
          <v-list-item-content class="overflow-visible">
            <v-list-item-title>
              Touch alert volume
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action-text v-if="alertVolume === 0">
            Disabled
          </v-list-item-action-text>
          <v-list-item-action-text v-else>
            {{ alertVolume === null ? '--' : Math.round(alertVolume * 100) }}%
          </v-list-item-action-text>
        </div>
        <v-slider
          :value="alertVolume"
          :disabled="alertVolume === null"
          dense
          hide-details
          min="0"
          max="1"
          step="0.01"
          thumb-label
          prepend-icon="mdi-volume-low"
          append-icon="mdi-volume-high"
          thumb-size="36"
          @click:prepend="decreaseAlertVolume"
          @click:append="increaseAlertVolume"
          @change="setAlertVolume"
        >
          <template #thumb-label="{ value }">
            <v-icon
              v-if="value === 0"
              small
              dark
            >
              mdi-volume-off
            </v-icon>
            <span v-else>{{ Math.round(value * 100) }}%</span>
          </template>
        </v-slider>
      </v-list-item>
      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title>
            Enable false alert shortcut
          </v-list-item-title>
          <v-list-item-subtitle>
            Press Ctrl + Alt + F to remove previous touch from history
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-switch
            :input-value="false"
            readonly
          />
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
  import _ from 'lodash';
  import ding from '../../../assets/face-touch-ding.wav';

  export default {
    data: () => ({
      alertAudio: new Audio(ding),
      playAlertDebounced: null,
    }),
    computed: {
      alertVolume() {
        return this.$store.state.alertVolume;
      },
    },
    created() {
      this.playAlertDebounced = _.debounce(this.playAlert, 350);
    },
    methods: {
      setAlertVolume(value) {
        this.$comm.setAlertVolume(value);
        this.playAlertDebounced();
      },
      decreaseAlertVolume() {
        this.setAlertVolume(Math.max((Math.ceil(this.alertVolume * 20) - 1) / 20, 0));
      },
      increaseAlertVolume() {
        this.setAlertVolume(Math.min((Math.floor(this.alertVolume * 20) + 1) / 20, 1));
      },
      playAlert() {
        if (this.alertVolume === 0) return;
        this.alertAudio.volume = this.alertVolume;
        this.alertAudio.currentTime = 0;
        this.alertAudio.play();
      },
    },
  };
</script>
