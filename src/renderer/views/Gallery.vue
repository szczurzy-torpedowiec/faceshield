<template>
  <div class="pa-4 mx-auto gallery">
    <v-row>
      <v-col
          v-for="(touch, index) in touches"
          :key="touch.timestamp"
          class="d-flex child-flex"
          cols="4"
      >
        <v-card>
          <vue-freezeframe
              :src="`file:///${touch.gifPath}`"
          />
          <v-card-subtitle class="pa-2">
            <v-row>
              <v-col class="py-0 d-flex align-center">
                <timeago :datetime="touch.timestamp"/>
              </v-col>
              <v-col class="py-0" align="right">
                <v-btn icon @click="deleteTouch(index, touch.timestamp)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
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
    methods: {
      deleteTouch(index, timestamp) {
        this.touches.splice(index, 1);
        this.$comm.removeTouch(timestamp);
      },
    },
    mounted() {
      this.touches = this.$store.state.touches.sort((a,b) => {
        if (a.timestamp < b.timestamp) return 1;
        if (a.timestamp > b.timestamp) return -1;
        return 0;
      })
    },
  }
</script>