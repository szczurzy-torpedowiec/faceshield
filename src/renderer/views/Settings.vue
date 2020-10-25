<template>
  <div class="pa-4 mx-auto settings">
    <control-tile />
    <device-settings class="mt-4" />
    <autostart-settings class="mt-4" />
    <alert-settings class="mt-4" />
    <other-settings class="mt-4" />
    <v-btn
      color="primary"
      text
      block
      class="mt-8 mb-4"
    >
      Open user data folder
    </v-btn>
  </div>
</template>

<script>
  import ControlTile from '../components/ControlTile.vue';
  import DeviceSettings from '../components/settings/DeviceSettings.vue';
  import AutostartSettings from '../components/settings/AutostartSettings.vue';
  import AlertSettings from '../components/settings/AlertSettings.vue';
  import OtherSettings from '../components/settings/OtherSettings.vue';

  export default {
    components: {
      ControlTile,
      DeviceSettings,
      AutostartSettings,
      AlertSettings,
      OtherSettings,
    },
    beforeRouteLeave(to, from, next) {
      this.$comm.stopPreview();
      next();
    },
    methods: {
      openUserData() {
        this.$comm.openUserData();
      },
    },
  };
</script>

<style lang="scss">
  .settings {
    max-width: 800px;
  }
</style>
