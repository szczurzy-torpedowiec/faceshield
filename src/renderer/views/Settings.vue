<template>
  <div class="px-4 py-2 mx-auto settings">
    <control-tile />
    <v-card
      outlined
      class="mt-4 d-flex flex-column"
    >
      <v-card-title>Device configuration</v-card-title>
      <v-btn-toggle
        v-model="selectedDevice"
        mandatory
        class="align-self-center mb-4"
        dense
      >
        <v-btn value="kinect">
          <v-icon left>
            mdi-microsoft-xbox
          </v-icon>
          Kinect
        </v-btn>
        <v-btn value="webcam">
          <v-icon left>
            mdi-webcam
          </v-icon>
          Webcam
        </v-btn>
        <v-btn value="mobile">
          <v-icon left>
            mdi-cellphone
          </v-icon>
          Mobile
        </v-btn>
      </v-btn-toggle>
      <v-divider />
      <div class="d-flex flex-column flex-md-row">
        <div class="d-flex flex-column mt-4 just-grow">
          <v-fade-transition mode="out-in">
            <div
              v-if="selectedDevice === 'kinect'"
              :key="'device-kinect'"
              class="mx-3"
            >
              <v-alert
                type="info"
                text
                outlined
                class="mb-4"
              >
                Face Shield only works with Kinect v1 drivers.
                Make sure you have installed correct one
              </v-alert>
            </div>
            <div
              v-else-if="selectedDevice === 'webcam'"
              :key="'device-webcam'"
            >
              <v-list subheader>
                <video-input-select />
                <v-list-item
                  link
                  :disabled="useCpuBackend === null"
                  @click="toggleUseCpuBackend"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      Use CPU backend
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      Slow, not recommended
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-switch
                      :input-value="useCpuBackend"
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
                        Wait between frames
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        Increase the wait to reduce resource use
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action-text>
                      {{ webcamFrameWait === null ? '--' : webcamFrameWait }} ms
                    </v-list-item-action-text>
                  </div>
                  <v-slider
                    :value="webcamFrameWait"
                    :disabled="webcamFrameWait === null"
                    dense
                    hide-details
                    min="0"
                    max="500"
                    step="25"
                    ticks
                    thumb-label
                    @change="setWebcamFrameWait"
                  />
                </v-list-item>
              </v-list>
            </div>
          </v-fade-transition>
        </div>
        <v-divider
          vertical
          class="hidden-sm-and-down"
        />
        <div class="shrink mb-4 mt-md-4 mx-3 align-self-center">
          <v-card
            outlined
            width="320"
          >
            <canvas
              width="320"
              height="240"
            /><!-- TODO: Set height dynamically -->
            <v-btn
              class="preview-close"
              icon
              color="primary"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-skeleton-loader
              type="image@2"
              height="240"
              tile
            />
            <v-sheet
              tile
              color="grey darken-3"
              height="240"
              class="d-flex flex-column align-center justify-center"
            >
              <v-icon
                :size="96"
                dark
              >
                mdi-camera
              </v-icon>
              <v-btn
                color="primary"
                class="mt-2"
              >
                Show preview
              </v-btn>
            </v-sheet>
            <v-divider />
            <v-alert
              text
              tile
              color="grey darken-3"
              type="info"
              class="my-0"
            >
              Preview is turned off
            </v-alert>
            <v-divider />
            <v-alert
              text
              tile
              color="deep-orange"
              icon="mdi-emoticon-sad"
              class="my-0"
            >
              Face not detected
            </v-alert>
            <v-divider />
            <v-alert
              text
              tile
              color="deep-orange"
              icon="mdi-hand-left"
              class="my-0"
            >
              Hands not detected
            </v-alert>
            <v-divider />
            <v-alert
              text
              tile
              color="blue"
              type="info"
              class="my-0"
            >
              Hands aren't touching face
            </v-alert>
            <v-divider />
            <v-alert
              text
              tile
              color="amber darken-2"
              type="info"
              class="my-0"
            >
              Hands are close to face
            </v-alert>
            <v-divider />
            <v-alert
              text
              tile
              color="amber darken-4"
              type="info"
              class="my-0"
            >
              Hands are touching face
            </v-alert>
          </v-card>
        </div>
      </div>
    </v-card>
    <v-card
      outlined
      class="mt-4"
    >
      <v-card-title>
        Autostart
      </v-card-title>
      <v-progress-circular
        v-if="autostartConfig === null"
        indeterminate
        class="mx-auto my-4 d-block"
        :size="48"
        color="primary"
      />
      <v-list v-else>
        <v-list-item @click="toggleAutostartEnabled">
          <v-list-item-title>
            Launch app on system startup
          </v-list-item-title>
          <v-list-item-action>
            <v-switch
              :input-value="autostartConfig.enabled"
              readonly
            />
          </v-list-item-action>
        </v-list-item>
        <v-list-item
          :disabled="!autostartConfig.enabled"
          @click="toggleAutostartStartTracking"
        >
          <v-list-item-title>
            Start tracking on startup
          </v-list-item-title>
          <v-list-item-action>
            <v-switch
              :input-value="autostartConfig.startTracking"
              readonly
              :disabled="!autostartConfig.enabled"
            />
          </v-list-item-action>
        </v-list-item>
        <v-list-item
          :disabled="!autostartConfig.enabled"
          @click="toggleAutostartMinimise"
        >
          <v-list-item-title>
            Launch minimised
          </v-list-item-title>
          <v-list-item-action>
            <v-switch
              :input-value="autostartConfig.minimise"
              readonly
              :disabled="!autostartConfig.enabled"
            />
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script>
  import ControlTile from '../components/ControlTile.vue';
  import VideoInputSelect from '../components/settings/VideoInputSelect.vue';

  export default {
    components: {
      ControlTile,
      VideoInputSelect,
    },
    data: () => ({
      selectedDevice: 'kinect',
    }),
    computed: {
      autostartConfig() {
        return this.$store.state.autostartConfig;
      },
      useCpuBackend() {
        return this.$store.state.useCpuBackend;
      },
      webcamFrameWait() {
        return this.$store.state.webcamFrameWait;
      },
    },
    methods: {
      toggleAutostartEnabled() {
        this.$comm.setAutostartConfig({
          ...this.autostartConfig,
          enabled: !this.autostartConfig.enabled,
        });
      },
      toggleAutostartStartTracking() {
        this.$comm.setAutostartConfig({
          ...this.autostartConfig,
          startTracking: !this.autostartConfig.startTracking,
        });
      },
      toggleAutostartMinimise() {
        this.$comm.setAutostartConfig({
          ...this.autostartConfig,
          minimise: !this.autostartConfig.minimise,
        });
      },
      toggleUseCpuBackend() {
        this.$comm.setUseCpuBackend(!this.useCpuBackend);
      },
      setWebcamFrameWait(wait) {
        this.$comm.setWebcamFrameWait(wait);
      },
    },
  };
</script>

<style lang="scss">
  .settings {
    max-width: 800px;

    .just-grow {
      flex-grow: 1;
    }

    .preview-close {
      position: absolute;
      top: 8px;
      right: 8px;
    }
  }
</style>
