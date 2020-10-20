<template>
  <div>
    <v-menu nudge-top="4">
      <template #activator="{ on }">
        <v-list-item
          :disabled="videoInputs === null || !videoInputLoaded"
          v-on="on"
        >
          <v-list-item-content>
            <v-list-item-title>
              Camera
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ videoInput === null ? 'Default' : videoInput.label }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-icon class="align-self-center">
            <v-icon>mdi-menu-down</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </template>
      <v-card>
        <v-list>
          <v-list-item
            link
            color="primary"
            :input-value="videoInput === null"
            @click="setVideoInput(null)"
          >
            <v-list-item-content>
              <v-list-item-title>
                Default
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-if="videoInputDisconnected"
            :input-value="true"
            link
            color="primary"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ videoInput.label }}
              </v-list-item-title>
              <v-list-item-subtitle>
                Disconnected
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-icon>
              mdi-power-plug-off
            </v-icon>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-list>
          <v-list-item
            v-for="input in videoInputs"
            :key="input.deviceId"
            :input-value="videoInput !== null && input.deviceId === videoInput.deviceId"
            @click="setVideoInput(input)"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ input.label }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
    <v-expand-transition>
      <div v-if="videoInputDisconnected">
        <v-alert
          type="error"
          dense
          class="mb-3 mt-1 mx-3"
        >
          Selected camera is disconnected
        </v-alert>
      </div>
    </v-expand-transition>
  </div>
</template>

<script>
  export default {
    data: () => ({
      videoInputs: null,
    }),
    computed: {
      videoInputLoaded() {
        return this.$store.state.videoInputLoaded;
      },
      videoInput() {
        return this.$store.state.videoInput;
      },
      videoInputDisconnected() {
        if (this.videoInputs === null) return null;
        if (this.videoInput === null) return false;
        return this.videoInputs.findIndex(
          (input) => input.deviceId === this.videoInput.deviceId,
        ) === -1;
      },
    },
    async created() {
      await this.updateVideoInputs();
      navigator.mediaDevices.addEventListener('devicechange', this.updateVideoInputs);
    },
    beforeDestroy() {
      navigator.mediaDevices.removeEventListener('devicechange', this.updateVideoInputs);
    },
    methods: {
      async updateVideoInputs() {
        const devices = await navigator.mediaDevices.enumerateDevices();
        this.videoInputs = devices.filter((device) => device.kind === 'videoinput');
      },
      setVideoInput(input) {
        if (input === null) {
          this.$comm.setVideoInput(null);
          return;
        }
        this.$comm.setVideoInput({
          deviceId: input.deviceId,
          label: input.label,
        });
      },
    },
  };
</script>
