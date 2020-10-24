<template>
  <div class="px-4 py-2 mx-auto settings">
    <control-tile />
    <device-settings class="mt-4" />
    <autostart-settings class="mt-4" />
    <alert-settings class="mt-4" />
  </div>
</template>

<script>
  import ControlTile from '../components/ControlTile.vue';
  import DeviceSettings from '../components/settings/DeviceSettings.vue';
  import AutostartSettings from '../components/settings/AutostartSettings.vue';
  import AlertSettings from '../components/settings/AlertSettings.vue';

  export default {
    components: {
      ControlTile,
      DeviceSettings,
      AutostartSettings,
      AlertSettings,
    },
    beforeRouteLeave(to, from, next) {
      this.$comm.stopPreview();
      next();
    },
  };
</script>

<style lang="scss">
  .settings {
    max-width: 800px;
  }
</style>
