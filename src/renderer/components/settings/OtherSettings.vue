<template>
  <v-card outlined>
    <v-card-title>
      Other
    </v-card-title>
    <v-list>
      <v-list-item
        @click="toggleDarkTheme"
      >
        <v-list-item-content>
          <v-list-item-title>
            Dark theme
          </v-list-item-title>
          <v-list-item-subtitle>
            A.K.A. "The killer feature"
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-switch
            :input-value="darkTheme"
            readonly
          />
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
  export default {
    computed: {
      darkTheme() {
        return this.$store.state.config.darkTheme;
      },
    },
    methods: {
      toggleDarkTheme() {
        this.$comm.setConfigItem('darkTheme', !this.darkTheme);
      },
    },
  };
</script>
