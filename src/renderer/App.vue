<template>
  <v-app>
    <navigation />
    <v-main>
      <v-scroll-x-transition mode="out-in">
        <router-view />
      </v-scroll-x-transition>
    </v-main>
  </v-app>
</template>

<script>
import Navigation from "./components/Navigation";
export default {
  name: 'App',
  components: {Navigation},
};
</script>
