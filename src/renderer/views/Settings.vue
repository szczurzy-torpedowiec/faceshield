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
      <div class="d-flex flex-column flex-md-row">
        <div class="d-flex flex-column mx-4 mr-md-0 mb-4 just-grow">
          <v-fade-transition mode="out-in">
            <div v-if="selectedDevice === 'kinect'">
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
          </v-fade-transition>
        </div>
        <div class="shrink mx-4 align-self-center mb-4">
          <v-card
            outlined
            width="320"
          >
            <canvas
              v-show="previewToggle && imageAvailable"
              ref="previewCanvasElement"
              width="320"
              height="240"
            /><!-- TODO: Set height dynamically -->
            <v-btn
              v-if="previewToggle"
              class="preview-close"
              icon
              color="primary"
              @click="previewToggle = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-skeleton-loader
              v-if="previewToggle && !imageAvailable && trackingActive"
              type="image@2"
              height="240"
              tile
            />
            <v-sheet
              v-if="!previewToggle || !trackingActive"
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
                :disabled="!trackingActive"
                @click="previewToggle = true"
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

  export default {
    components: {
      ControlTile,
    },
    data: () => ({
      selectedDevice: 'kinect',
      previewImage: null,
      imageAvailable: false,
      previewToggle: false,
    }),
    computed: {
      autostartConfig() {
        return this.$store.state.autostartConfig;
      },
      trackingActive() {
        return this.$store.state.trackingActive;
      },
    },
    created() {
      window.ipcRenderer.on('update-preview', (event, args) => {
        this.imageAvailable = true;
        this.previewImage.src = args;
      });
    },
    mounted() {
      this.attachCanvas();
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
      attachCanvas() {
        const c = this.$refs.previewCanvasElement;
        const ctx = c.getContext('2d');
        const image = new Image();
        image.onload = function () {
          ctx.drawImage(image, 0, 0, c.width, c.height);
        };
        this.previewImage = image;
      },
    },
    watch: {
      trackingActive() {
        if (!this.trackingActive) {
          this.imageAvailable = false;
        }
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
