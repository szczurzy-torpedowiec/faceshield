<template>
  <v-card
    outlined
    class="device-settings d-flex flex-column"
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
          <template v-if="previewActive">
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
            :value="previewActive"
            color="blue"
            icon="mdi-emoticon"
          >
            Hands aren't touching face
          </preview-alert>
          <preview-alert
            :value="previewActive"
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
          return !this.skeleton.handLeft && !this.skeleton.handRight;
        }
        return null;
      },
      faceNotDetected() {
        if (this.tracker === 'webcam' && this.webcamData !== null) return this.webcamData.facesBounds.length === 0;
        if (this.tracker === 'kinect' && this.skeleton !== null) {
          return !this.skeleton.headTopLeft || !this.skeleton.headBottomRight;
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
    },
    methods: {
      toggleUseCpuBackend() {
        this.$comm.setUseCpuBackend(!this.useCpuBackend);
      },
      setWebcamFrameWait(wait) {
        this.$comm.setWebcamFrameWait(wait);
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
        const hands = [
          this.skeleton.handLeft,
          this.skeleton.handRight,
        ].filter((hand) => !!hand);
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
        if (this.skeleton.headTopLeft && this.skeleton.headBottomRight) {
          ctx.strokeStyle = '#049';
          ctx.lineWidth = 3;
          ctx.strokeRect(
            this.skeleton.headTopLeft.x * this.scale,
            this.skeleton.headTopLeft.y * this.scale,
            (this.skeleton.headTopLeft.y - this.skeleton.headBottomRight.y) * this.scale,
            (this.skeleton.headBottomRight.y - this.skeleton.headTopLeft.y) * this.scale,
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
