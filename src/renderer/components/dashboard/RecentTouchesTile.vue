<template>
  <v-card
    outlined
    class="dashboard-recent-touches-tile h5 d-flex flex-column text-center pt-2 pb-4 px-4"
  >
    <div class="font-weight-light">
      You touched your face
    </div>
    <div class="h4">
      {{ timesTouched }} {{ timesTouched === 1 ? 'time' : 'times' }}
    </div>
    <div class="font-weight-light">
      in the last
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
        { text: '15 minutes', value: 0.25 },
        { text: '30 minutes', value: 0.5 },
        { text: '1 hour', value: 1 },
        { text: '2 hours', value: 2 },
        { text: '4 hours', value: 4 },
        { text: '8 hours', value: 8 },
        { text: '24 hours', value: 24 },
        { text: '48 hours', value: 48 },
      ],
    }),
    computed: {
      period() {
        return this.$store.state.config.recentTouchesTilePeriod;
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
    },
    watch: {
      touches() {
        this.now = new Date();
      },
    },
    created() {
      setInterval(() => {
        this.now = new Date();
      }, 30000);
    },
    methods: {
      setPeriod(value) {
        this.$comm.setConfigItem('recentTouchesTilePeriod', value);
      },
    },
  };
</script>
