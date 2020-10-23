<template>
  <div class="px-4 py-2 mx-auto settings">
    <control-tile />
    <device-settings class="mt-4" />
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
    <alert-settings class="mt-4" />
  </div>
</template>

<script>
  import ControlTile from '../components/ControlTile.vue';
  import DeviceSettings from '../components/settings/DeviceSettings.vue';
  import AlertSettings from '../components/settings/AlertSettings.vue';

  export default {
    components: {
      ControlTile,
      DeviceSettings,
      AlertSettings,
    },
    beforeRouteLeave(to, from, next) {
      this.$comm.stopPreview();
      next();
    },
    computed: {
      autostartConfig() {
        return this.$store.state.autostartConfig;
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
    },
  };
</script>

<style lang="scss">
  .settings {
    max-width: 800px;
  }
</style>
