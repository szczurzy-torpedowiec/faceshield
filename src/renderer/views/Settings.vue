<template>
  <div class="px-4 py-2 mx-auto settings">
    <control-tile />
    <v-card
      outlined
      class="mt-4 d-flex flex-column"
    >
      <v-card-title>Device configuration</v-card-title>
      <v-btn-toggle
        v-model="tracker"
        :mandatory="tracker !== null"
        class="align-self-center mb-4"
        dense
      >
        <v-btn
          value="kinect"
          large
        >
          <v-icon left>
            mdi-microsoft-xbox
          </v-icon>
          Kinect
        </v-btn>
        <v-btn
          value="webcam"
          large
        >
          <v-icon left>
            mdi-webcam
          </v-icon>
          Webcam
        </v-btn>
        <v-btn
          disabled
          value="mobile"
          large
        >
          <v-icon left>
            mdi-cellphone
          </v-icon>
          Mobile<br>
          (Planned)
        </v-btn>
      </v-btn-toggle>
      <v-divider />
      <div class="d-flex flex-column flex-md-row">
        <div class="d-flex flex-column mt-4 just-grow">
          <v-fade-transition mode="out-in">
            <div
              v-if="tracker === 'kinect'"
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
              v-else-if="tracker === 'webcam'"
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
          >
            <template v-if="previewToggle">
              <v-sheet
                v-if="image === null"
                tile
                color="grey lighten-2"
                width="320"
                height="240"
                class="d-flex flex-column align-center justify-center"
              >
                <v-progress-circular
                  indeterminate
                  color="primary"
                  :size="64"
                />
                <h1 class="mt-3">
                  Loading
                </h1>
                <div>This might take a few minutes</div>
              </v-sheet>
              <div
                v-show="image !== null"
                class="d-flex"
              >
                <img
                  v-if="image !== null"
                  :src="image"
                  width="320"
                  :height="height"
                  alt="Camera preview"
                >
                <canvas
                  ref="previewSkeleton"
                  width="320"
                  :height="height"
                  class="preview-skeleton"
                />
              </div>
              <v-btn
                class="preview-close"
                icon
                color="primary"
                @click="previewToggle = false"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            <v-sheet
              v-else
              tile
              color="grey darken-3"
              width="320"
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
                v-if="trackingActive"
                color="primary"
                class="mt-2"
                :disabled="!trackingActive"
                @click="previewToggle = true"
              >
                Show preview
              </v-btn>
              <div
                v-else
                class="mt-2 py-1 text-h6 grey--text text--lighten-1"
              >
                Tracking paused
              </div>
            </v-sheet>
            <v-divider />
            <v-alert
              text
              tile
              icon="mdi-alert-circle"
              color="red"
              class="my-0"
            >
              Cannot load ML models<br>
              Check your internet connection
            </v-alert>
            <v-divider />
            <v-alert
              text
              tile
              icon="mdi-alert-circle"
              color="red"
              class="my-0"
            >
              Cannot load video stream
            </v-alert>
            <v-divider />
            <v-alert
              text
              tile
              color="amber darken-2"
              icon="mdi-face"
              class="my-0"
            >
              Face not detected
            </v-alert>
            <v-divider />
            <v-alert
              text
              tile
              color="amber darken-2"
              icon="mdi-hand-left"
              class="my-0"
            >
              Hands not detected
            </v-alert>
            <v-divider />
            <v-alert
              text
              tile
              icon="mdi-emoticon"
              color="blue"
              class="my-0"
            >
              Hands aren't touching face
            </v-alert>
            <v-divider />
            <v-alert
              text
              tile
              icon="mdi-emoticon-sad"
              color="deep-orange"
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
    <v-card
      outlined
      class="mt-4"
    >
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
      kinectImage: null,
      webcamData: null,
      previewToggle: false,
    }),
    computed: {
      autostartConfig() {
        return this.$store.state.autostartConfig;
      },
      trackingActive() {
        return this.$store.state.trackingActive;
      },
      scale() {
        if (this.tracker === 'webcam' && this.webcamData !== null) {
          return 320 / this.webcamData.width;
        } if (this.tracker === 'kinect') return 320 / this.$refs.imagePreview.naturalWidth;
        return null;
      },
      height() {
        if (this.tracker === 'webcam' && this.webcamData !== null) {
          return Math.floor(320 * (this.webcamData.height / this.webcamData.width));
        }
        return 240;
      },
      image() {
        if (this.tracker === 'webcam' && this.webcamData !== null) return this.webcamData.image;
        if (this.tracker === 'kinect') return this.kinectImage;
        return null;
      },
      useCpuBackend() {
        return this.$store.state.useCpuBackend;
      },
      webcamFrameWait() {
        return this.$store.state.webcamFrameWait;
      },
      tracker: {
        get() {
          return this.$store.state.tracker;
        },
        set(value) {
          this.$comm.setTracker(value);
        },
      },
    },
    watch: {
      trackingActive(value) {
        if (!value) {
          this.previewToggle = false;
          this.resetState();
        }
      },
      tracker() {
        this.resetState();
      },
    },
    created() {
      window.ipcRenderer.on('update-preview', (event, image) => { this.kinectImage = image; });
      window.ipcRenderer.on('update-skeleton', (event, skeleton) => this.drawKinectSkeleton(skeleton));
      window.ipcRenderer.on('update-webcam-data', (event, data) => {
        this.webcamData = data;
        this.drawWebcamSkeleton();
      });
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
      drawKinectSkeleton(skeleton) {
        if (!this.previewToggle || !this.$refs.previewSkeleton) return;

        const ctx = this.$refs.previewSkeleton.getContext('2d');
        ctx.clearRect(0, 0, 320, this.height);
        const hands = [skeleton.handLeft, skeleton.handRight].filter((hand) => !!hand);
        ctx.fillStyle = '#0c0';
        hands.forEach((hand) => {
          ctx.beginPath();
          ctx.arc(
            hand.x * this.scale,
            hand.y * this.scale,
            10,
            0,
            Math.PI * 2,
            true,
          );
          ctx.closePath();
          ctx.fill();
        });
        if (skeleton.headTopLeft && skeleton.headBottomRight) {
          ctx.strokeStyle = '#049';
          ctx.lineWidth = 3;
          ctx.strokeRect(
            skeleton.headTopLeft.x * this.scale,
            skeleton.headTopLeft.y * this.scale,
            (skeleton.headTopLeft.y - skeleton.headBottomRight.y) * this.scale,
            (skeleton.headBottomRight.y - skeleton.headTopLeft.y) * this.scale,
          );
        }
      },
      drawWebcamSkeleton() {
        if (!this.$refs.previewSkeleton) return;
        const ctx = this.$refs.previewSkeleton.getContext('2d');
        ctx.clearRect(0, 0, 320, this.height);
        if (this.webcamData === null) return;

        this.webcamData.hands.forEach((hand) => {
          ctx.strokeStyle = '#0c0';
          ctx.lineWidth = 3;
          hand.landmarks.forEach(([x, y], index) => {
            if (index === 0) return;
            let lineEndIndex = index - 1;
            if (lineEndIndex % 4 === 0) lineEndIndex = 0;
            const [endX, endY] = hand.landmarks[lineEndIndex];
            ctx.beginPath();
            ctx.moveTo(x * this.scale, y * this.scale);
            ctx.lineTo(endX * this.scale, endY * this.scale);
            ctx.stroke();
          });

          ctx.fillStyle = '#0c0';
          hand.landmarks.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(
              x * this.scale,
              y * this.scale,
              3,
              0,
              Math.PI * 2,
              true,
            );
            ctx.closePath();
            ctx.fill();
          });
        });

        ctx.strokeStyle = '#049';
        ctx.lineWidth = 3;
        this.webcamData.facesBounds.forEach(({
          left, right, top, bottom,
        }) => {
          ctx.strokeRect(
            left * this.scale,
            top * this.scale,
            (right - left) * this.scale,
            (bottom - top) * this.scale,
          );
        });
      },
      clearSkeleton() {
        if (!this.$refs.previewSkeleton) return;
        const ctx = this.$refs.previewSkeleton.getContext('2d');
        ctx.clearRect(0, 0, 320, this.height);
      },
      resetState() {
        this.kinectImage = null;
        this.clearSkeleton();
        this.webcamData = null;
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

    .preview-skeleton {
      position: absolute;
      left: 0;
      top: 0;
    }
  }
</style>
