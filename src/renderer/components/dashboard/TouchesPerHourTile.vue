<template>
  <v-card
    outlined
    class="dashboard-touches-per-hour-tile h5 d-flex flex-column text-center pt-2 pb-4 px-4"
  >
    <div class="font-weight-light">
      Your touch rate was
    </div>
    <div class="h4 d-flex align-center justify-center">
      1 per hour
      <v-menu offset-y>
        <template #activator="{ on }">
          <v-btn
            icon
            small
            class="ml-1"
            v-on="on"
          >
            <v-icon>mdi-help-circle</v-icon>
          </v-btn>
        </template>
        <v-card max-width="350">
          <v-card-text>
            This metric shows the number of touches, divided by the time,
            during which the tracking was active and your face was detected.
          </v-card-text>
        </v-card>
      </v-menu>
    </div>
    <div class="font-weight-light">
      during the last
    </div>
    <v-select
      dense
      filled
      :items="['4 hours', '8 hours', '1 day', '2 days', '3 days', '5 days', 'week', '2 weeks']"
      hide-details
    />
  </v-card>
</template>
