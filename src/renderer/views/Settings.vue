<template>
  <div class="px-4 py-2 settings">
    <h1>Settings</h1>
    <v-card>
      <v-card-title>Device configuration</v-card-title>
      <v-row class="px-4">
        <v-col>
          <v-select
              :items="deviceSelectItems"
              outlined
              persistent-hint
              :hint="deviceHint"
              v-model="selectedDevice"
          />
        </v-col>
        <v-col>
          <v-card class="preview-card" outlined>
            <canvas class="preview" width="640" height="480"/>
          </v-card>
          <v-alert
              color="gray"
              outlined
              text
              type="info"
              class="mt-2"
          >Preview is turned off</v-alert>
          <v-alert
              color="orange"
              outlined
              text
              type="error"
              class="mt-2"
          >I can't determine your hands position. Try to move back.</v-alert>
          <v-alert
              color="gray"
              outlined
              text
              type="info"
              class="mt-2"
          >Hands aren't touching face</v-alert>
          <v-alert
              color="blue"
              outlined
              text
              type="info"
              class="mt-2"
          >Hands are touching face</v-alert>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    deviceSelectItems: ['Kinect'],
    selectedDevice: '',
  }),
  computed: {
    deviceHint: function () {
      if (this.selectedDevice === 'Kinect') {
        return 'Face Shield only works with Kinect v1 drivers. Make sure you have installed correct one.'
      }
      return ''
    }
  }
}
</script>

<style>
  .preview {
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
  }
  .preview-card {
    height: 0;
    padding-bottom: 75%;
    position: relative;
  }
</style>