<template>
  <v-card outlined>
    <v-card-title>
      Autostart
    </v-card-title>
    <v-alert
      v-if="isDevelopment"
      type="warning"
      text
      class="mb-0 mx-3"
    >
      Autostart cannot be enabled in development mode
    </v-alert>
    <v-list>
      <v-list-item
        :disabled="isDevelopment"
        @click="toggleAutostartEnabled"
      >
        <v-list-item-title>
          Launch app on system startup
        </v-list-item-title>
        <v-list-item-action>
          <v-switch
            :disabled="isDevelopment"
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
</template>

<script>
  export default {
    data: () => ({
      isDevelopment: process.env.NODE_ENV !== 'production',
    }),
    computed: {
      autostartConfig() {
        return this.$store.state.config.autostart;
      },
    },
    methods: {
      toggleAutostartEnabled() {
        if (this.isDevelopment) return;
        this.$comm.setConfigItem('autostart.enabled', !this.autostartConfig.enabled);
      },
      toggleAutostartStartTracking() {
        this.$comm.setConfigItem('autostart.startTracking', !this.autostartConfig.startTracking);
      },
      toggleAutostartMinimise() {
        this.$comm.setConfigItem('autostart.minimise', !this.autostartConfig.minimise);
      },
    },
  };
</script>
