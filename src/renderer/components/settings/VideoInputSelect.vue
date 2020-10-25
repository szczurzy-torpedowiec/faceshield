<template>
  <div>
    <v-menu nudge-top="4">
      <template #activator="{ on }">
        <v-list-item
          :disabled="videoInputs === null"
          v-on="on"
        >
          <v-list-item-content>
            <v-list-item-title>
              Camera
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ videoInputLabel === null ? 'Default' : videoInputLabel }}
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
            :input-value="videoInputLabel === null"
            @click="setVideoInputLabel(null)"
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
                {{ videoInputLabel }}
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
            v-for="label in videoInputs"
            :key="label"
            :input-value="videoInputLabel !== null && label === videoInputLabel"
            @click="setVideoInputLabel(label)"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ label }}
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
      videoInputLabel() {
        return this.$store.state.config.videoInputLabel;
      },
      videoInputDisconnected() {
        if (this.videoInputs === null) return null;
        if (this.videoInputLabel === null) return false;
        return !this.videoInputs.includes(this.videoInputLabel);
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
        this.videoInputs = devices
          .filter((device) => device.kind === 'videoinput')
          .map((device) => device.label);
      },
      setVideoInputLabel(label) {
        this.$comm.setConfigItem('videoInputLabel', label);
      },
    },
  };
</script>
