<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      permanent
      :expand-on-hover="$vuetify.breakpoint.smAndDown"
    >
      <div class="d-flex flex-column fill-height">
        <v-list>
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Dashboard
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="/stats">
            <v-list-item-icon>
              <v-icon>mdi-chart-timeline-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Statistics
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="/gallery">
            <v-list-item-icon>
              <v-icon>mdi-video</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Gallery
            </v-list-item-title>
          </v-list-item>
        </v-list>
        <v-spacer />
        <v-divider />
        <v-list>
          <v-list-item to="/settings">
            <v-list-item-icon>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Settings
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="/about">
            <v-list-item-icon>
              <v-icon>mdi-information</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              About
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </v-navigation-drawer>

    <v-main>
      <v-scroll-x-transition mode="out-in">
        <router-view />
      </v-scroll-x-transition>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    drawer: false,
  }),
};
</script>
