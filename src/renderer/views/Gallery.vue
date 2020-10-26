<template>
  <div
    v-if="touches === null"
    class="fill-height d-flex align-center justify-center"
  >
    <v-progress-circular
      indeterminate
      :size="96"
      color="primary"
    />
  </div>
  <div
    v-else-if="touches.length === 0"
    class="gallery fill-height d-flex align-center justify-center pa-4"
  >
    <h3 class="text-h5">
      There are no recordings yet
    </h3>
  </div>
  <div
    v-else
    class="pa-4 mx-auto gallery"
  >
    <v-row>
      <v-col
        v-for="(touch, index) in touches"
        :key="touch.timestamp"
        class="d-flex child-flex"
        cols="4"
      >
        <v-card class="d-flex flex-column overflow-hidden">
          <div class="grow">
            <vue-freezeframe
              v-if="touch.gifPath"
              :src="`file:///${touch.gifPath}`"
            />
            <v-sheet
              v-else
              color="blue-grey darken-3"
              class="grow fill-height d-flex align-center justify-center py-2"
              tile
            >
              <v-icon
                :size="64"
                dark
              >
                mdi-video-off
              </v-icon>
            </v-sheet>
          </div>
          <v-card-subtitle class="py-2 d-flex align-center">
            <timeago
              :datetime="touch.timestamp"
              auto-update
            />
            <v-spacer />
            <v-menu
              left
            >
              <template #activator="{ on }">
                <v-btn
                  icon
                  v-on="on"
                >
                  <v-icon>
                    mdi-delete
                  </v-icon>
                </v-btn>
              </template>
              <v-card :color="$vuetify.theme.isDark ? 'grey darken-3' : 'white'">
                <v-card-title>Delete event?</v-card-title>
                <v-card-subtitle>
                  You cannot undo this
                </v-card-subtitle>
                <v-card-actions>
                  <v-btn text>
                    Cancel
                  </v-btn>
                  <v-btn
                    color="red"
                    outlined
                    @click="deleteTouch(index, touch.timestamp)"
                  >
                    Delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import _ from 'lodash';

  export default {
    computed: {
      touches() {
        if (this.$store.state.touches === null) return null;
        return _.orderBy(this.$store.state.touches, ['timestamp'], ['desc']);
      },
    },
    methods: {
      deleteTouch(index, timestamp) {
        this.$comm.removeTouch(timestamp);
      },
    },
  };
</script>
