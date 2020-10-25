<template>
  <div class="pa-4 mx-auto gallery">
    <v-row>
      <v-col
        v-for="(touch, index) in touches"
        :key="touch.timestamp"
        class="d-flex child-flex"
        cols="4"
      >
        <v-card class="display-flex flex-column">
          <vue-freezeframe
            v-if="touch.gifPath"
            :src="`file:///${touch.gifPath}`"
          />
          <v-card-title
            v-else
            class="grow"
          >
            No recording
          </v-card-title>
          <v-card-subtitle class="py-2 display-flex">
            <v-col class="py-0 d-flex align-center">
              <timeago :datetime="touch.timestamp" />
            </v-col>
            <v-col class="py-0 align">
              <v-btn
                icon
                @click="deleteTouch(index, touch.timestamp)"
              >
                <v-spacer />
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    data: () => ({
      touches: [],
    }),
    mounted() {
      this.touches = this.$store.state.touches.sort((a, b) => {
        if (a.timestamp < b.timestamp) return 1;
        if (a.timestamp > b.timestamp) return -1;
        return 0;
      });
    },
    methods: {
      deleteTouch(index, timestamp) {
        this.touches.splice(index, 1);
        this.$comm.removeTouch(timestamp);
      },
    },
  };
</script>
