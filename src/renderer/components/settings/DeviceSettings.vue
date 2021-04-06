<template>
  <v-card
    outlined
    class="device-settings d-flex flex-column"
  >
    <v-card-title>Device configuration</v-card-title>
    <v-btn-toggle
      :value="tracker"
      class="align-self-center mb-4"
      dense
      mandatory
      @change="setTracker"
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
              class="mb-4"
            >
              Face Shield only works with Kinect v1 drivers.
              Make sure you have installed correct one
            </v-alert>
            <v-slider
              label="Tilt"
              :value="kinectTilt"
              dense
              hide-details
              min="-27"
              max="27"
              ticks
              thumb-label
              @change="setKinectTilt"
            />
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
                    {{ webcamFrameWait }} ms
                  </v-list-item-action-text>
                </div>
                <v-slider
                  :value="webcamFrameWait"
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
          <template v-if="previewActive">
            <v-sheet
              v-if="image === null"
              tile
              :color="$vuetify.theme.dark ? 'blue-grey darken-4' : 'grey lighten-2'"
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
              <div v-if="tracker === 'webcam'">
                This might take a few minutes
              </div>
            </v-sheet>
            <div
              v-show="image !== null"
              class="d-flex"
            >
              <img
                v-if="image !== null"
                ref="imagePreview"
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
            <v-tooltip left>
              <template #activator="{ on }">
                <v-btn
                  fab
                  class="preview-close"
                  color="primary"
                  small
                  @click="stopPreview"
                  v-on="on"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
              <span>Close preview</span>
            </v-tooltip>
          </template>
          <v-sheet
            v-else
            tile
            :color="$vuetify.theme.dark ? 'blue-grey darken-4' : 'grey darken-2'"
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
              color="primary"
              class="mt-2"
              @click="startPreview"
            >
              Show preview
            </v-btn>
          </v-sheet>
          <preview-alert
            :value="webcamModelsError"
            icon="mdi-alert-circle"
            color="red"
          >
            Cannot load ML models<br>
            Check your internet connection
          </preview-alert>
          <preview-alert
            :value="webcamCameraError"
            icon="mdi-alert-circle"
            color="red"
          >
            Cannot load video stream
          </preview-alert>
          <preview-alert
            :value="webcamExecuteError"
            icon="mdi-alert-circle"
            color="red"
          >
            There was an error during pose prediction
          </preview-alert>
          <preview-alert
            :value="previewActive && faceNotDetected"
            color="amber darken-2"
            icon="mdi-face"
          >
            Face not detected
          </preview-alert>
          <preview-alert
            :value="previewActive && handsNotDetected"
            color="amber darken-2"
            icon="mdi-hand-left"
          >
            Hands not detected
          </preview-alert>
          <preview-alert
            :value="previewActive && !touching"
            color="blue"
            icon="mdi-emoticon"
          >
            Hands aren't touching face
          </preview-alert>
          <preview-alert
            :value="previewActive && touching"
            color="deep-orange"
            icon="mdi-emoticon-sad"
          >
            Hands are touching face
          </preview-alert>
        </v-card>
      </div>
    </div>
  </v-card>
</template>

<script>
  import { debounce } from 'lodash';
  import PreviewAlert from './PreviewAlert.vue';
  import VideoInputSelect from './VideoInputSelect.vue';

  export default {
    components: {
      PreviewAlert,
      VideoInputSelect,
    },
    data: () => ({
      kinectImage: null,
      webcamData: null,
      skeleton: null,
      touching: false,
    }),
    computed: {
      trackingActive() {
        return this.$store.state.trackingActive;
      },
      previewActive() {
        return this.$store.state.previewActive;
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
      kinectTilt() {
        return this.$store.state.config.kinectTilt;
      },
      useCpuBackend() {
        return this.$store.state.config.useCpuBackend;
      },
      webcamFrameWait() {
        return this.$store.state.config.webcamFrameWait;
      },
      tracker() {
        return this.$store.state.config.tracker;
      },
      webcamModelsError() {
        if (this.tracker !== 'webcam') return null;
        return this.$store.state.webcamModelsError;
      },
      webcamCameraError() {
        if (this.tracker !== 'webcam') return null;
        return this.$store.state.webcamCameraError;
      },
      webcamExecuteError() {
        if (this.tracker !== 'webcam') return null;
        return this.$store.state.webcamExecuteError;
      },
      handsNotDetected() {
        if (this.tracker === 'webcam' && this.webcamData !== null) return this.webcamData.hands.length === 0;
        if (this.tracker === 'kinect' && this.skeleton !== null) {
          return this.skeleton.hands.length === 0;
        }
        return null;
      },
      faceNotDetected() {
        if (this.tracker === 'webcam' && this.webcamData !== null) return this.webcamData.facesBounds.length === 0;
        if (this.tracker === 'kinect' && this.skeleton !== null) {
          return !this.skeleton.head;
        }
        return null;
      },
    },
    watch: {
      previewActive(value) {
        if (!value) {
          this.resetState();
        }
      },
      tracker() {
        this.resetState();
      },
    },
    created() {
      window.ipcRenderer.on('update-preview', (event, image) => { this.kinectImage = image; });
      window.ipcRenderer.on('update-skeleton', (event, skeleton) => {
        this.skeleton = skeleton;
        this.drawKinectSkeleton();
      });
      window.ipcRenderer.on('update-webcam-data', (event, data) => {
        this.webcamData = data;
        this.drawWebcamSkeleton();
      });
      window.ipcRenderer.on('set-touching-preview', (event, touching) => { this.touching = touching; });
    },
    methods: {
      setTracker(value) {
        this.$comm.setConfigItem('tracker', value);
      },
      setKinectTilt: debounce(function updateTilt(tilt) {
        this.$comm.setConfigItem('kinectTilt', tilt);
      }, 1000),
      toggleUseCpuBackend() {
        this.$comm.setConfigItem('useCpuBackend', !this.useCpuBackend);
      },
      setWebcamFrameWait(wait) {
        this.$comm.setConfigItem('webcamFrameWait', wait);
      },
      startPreview() {
        this.$comm.startPreview();
      },
      stopPreview() {
        this.$comm.stopPreview();
      },
      drawKinectSkeleton() {
        if (!this.previewActive || !this.$refs.previewSkeleton) return;

        const ctx = this.$refs.previewSkeleton.getContext('2d');
        ctx.clearRect(0, 0, 320, this.height);
        ctx.fillStyle = '#0c0';
        this.skeleton.hands.forEach((hand) => {
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
        if (this.skeleton.head) {
          ctx.strokeStyle = '#049';
          ctx.lineWidth = 3;
          ctx.strokeRect(
            this.skeleton.head.x * this.scale,
            this.skeleton.head.y * this.scale,
            this.skeleton.head.dx * this.scale,
            this.skeleton.head.dy * this.scale,
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
        this.skeleton = null;
        this.webcamData = null;
      },
    },
  };
</script>

<style lang="scss">
  .device-settings {
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
