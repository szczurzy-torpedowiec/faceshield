<template>
  <v-card outlined>
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
</template>

<script>
  export default {
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
