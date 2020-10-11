<template>
  <v-card
    outlined
    class="dashboard-recent-touches-tile h5 d-flex flex-column text-center pt-2 pb-4 px-4"
  >
    <div class="font-weight-light">
      You touched your face
    </div>
    <div class="h4">
      1 time
    </div>
    <div class="font-weight-light">
      in the last
    </div>
    <v-select
      dense
      filled
      :items="['15 minutes', '30 minutes', '1 hour', '2 hours']"
      hide-details
    />
  </v-card>
</template>
