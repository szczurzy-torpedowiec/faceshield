<template>
  <v-app>
    <navigation />
    <v-main>
      <div
        v-if="configLoading"
        class="fill-height d-flex align-center justify-center flex-column"
      >
        <v-progress-circular
          indeterminate
          :size="96"
          color="primary"
        />
        <div class="text-h4 mt-6">
          Loading settings
        </div>
      </div>
      <v-scroll-x-transition
        v-else
        mode="out-in"
      >
        <router-view />
      </v-scroll-x-transition>
    </v-main>
  </v-app>
</template>

<script>
  import Navigation from './components/Navigation.vue';

  export default {
    name: 'App',
    components: { Navigation },
    computed: {
      configLoading() {
        return this.$store.state.config === null;
      },
    },
  };
</script>
