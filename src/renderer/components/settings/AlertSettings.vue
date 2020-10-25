<template>
  <v-card outlined>
    <v-card-title>
      Alerts
    </v-card-title>
    <v-list>
      <v-list-item
        @click="toggleOverlayAlertsEnabled"
      >
        <v-list-item-title>
          Enable overlay alerts
        </v-list-item-title>
        <v-list-item-action>
          <v-switch
            :input-value="overlayAlertsEnabled"
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
            {{ Math.round(alertVolume * 100) }}%
          </v-list-item-action-text>
        </div>
        <v-slider
          :value="alertVolume"
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
      <v-list-item @click="toggleShortcut">
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
            :input-value="shortcutEnabled"
            readonly
          />
        </v-list-item-action>
      </v-list-item>
      <v-list-item @click="toggleSaveGifs">
        <v-list-item-content>
          <v-list-item-title>
            Save touch recordings
          </v-list-item-title>
          <v-list-item-subtitle>
            Store short GIFs showing the moment you touch your face
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-switch
            :input-value="saveGifs"
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
      overlayAlertsEnabled() {
        return this.$store.state.config.overlayAlertsEnabled;
      },
      alertVolume() {
        return this.$store.state.config.alertVolume;
      },
      saveGifs() {
        return this.$store.state.config.saveGifs;
      },
      shortcutEnabled() {
        return this.$store.state.config.shortcutEnabled;
      },
    },
    created() {
      this.playAlertDebounced = _.debounce(this.playAlert, 350);
    },
    methods: {
      toggleOverlayAlertsEnabled() {
        this.$comm.setConfigItem('overlayAlertsEnabled', !this.overlayAlertsEnabled);
      },
      setAlertVolume(value) {
        this.$comm.setConfigItem('alertVolume', value);
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
      toggleSaveGifs() {
        this.$comm.setConfigItem('saveGifs', !this.saveGifs);
      },
      toggleShortcut() {
        this.$comm.setConfigItem('shortcutEnabled', !this.shortcutEnabled);
      },
    },
  };
</script>
