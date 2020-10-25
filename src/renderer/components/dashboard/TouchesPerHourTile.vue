<template>
  <v-card
    outlined
    class="dashboard-touches-per-hour-tile h5 d-flex flex-column text-center pt-2 pb-4 px-4"
  >
    <div class="font-weight-light">
      Your touch rate was
    </div>
    <div class="h4 d-flex align-center justify-center">
      {{ rateString }}
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
      :value="period"
      dense
      filled
      :items="periodItems"
      hide-details
      @change="setPeriod"
    />
  </v-card>
</template>

<script>
  export default {
    data: () => ({
      now: new Date(),
      periodItems: [
        { text: '2 hours', value: 2 },
        { text: '4 hours', value: 4 },
        { text: '8 hours', value: 8 },
        { text: '24 hours', value: 24 },
        { text: '2 days', value: 48 },
        { text: '3 days', value: 72 },
        { text: '5 days', value: 120 },
        { text: '1 week', value: 168 },
        { text: '2 week', value: 336 },
      ],
    }),
    computed: {
      period() {
        return this.$store.state.config.touchesPerHourTilePeriod;
      },
      timesTouched() {
        const { touches } = this.$store.state;
        const minTimestamp = this.now - this.period * 3600000; // hours to milliseconds
        let i = 0;
        while (i < touches.length) {
          if (touches[touches.length - i - 1].timestamp < minTimestamp) break;
          i += 1;
        }
        return i;
      },
      activeTimeDuration() {
        const { activeTimes } = this.$store.state;
        const minTimestamp = this.now - this.period * 3600000; // hours to milliseconds
        let totalDuration = 0;
        for (let i = activeTimes.length - 1; i >= 0; i -= 1) {
          const activeTime = activeTimes[i];
          if (activeTime.start < minTimestamp) {
            const durationInRange = activeTime.end - minTimestamp;
            if (durationInRange > 0) totalDuration += durationInRange;
            break;
          }
          totalDuration += activeTime.duration;
        }
        return totalDuration;
      },
      rate() {
        if (this.activeTimeDuration === 0) return 0;
        return this.timesTouched / (this.activeTimeDuration / 3600000);
      },
      rateString() {
        return `${this.rate.toLocaleString('en-US', {
          maximumFractionDigits: 1,
          minimumFractionDigits: 1,
        })} per hour`;
      },
    },
    watch: {
      touches() {
        this.now = new Date();
      },
    },
    created() {
      setInterval(() => {
        this.now = new Date();
      }, 60000);
    },
    methods: {
      setPeriod(value) {
        this.$comm.setConfigItem('touchesPerHourTilePeriod', value);
      },
    },
  };
</script>
