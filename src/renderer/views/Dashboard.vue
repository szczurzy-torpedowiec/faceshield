<template>
  <div class="pa-4 mx-auto dashboard">
    <control-tile />
    <recent-touches-tile v-if="loaded" />
    <touches-per-hour-tile v-if="loaded" />
    <touches-chart v-if="loaded" />
  </div>
</template>

<script>
  import TouchesChart from '../components/dashboard/TouchesChart.vue';
  import ControlTile from '../components/ControlTile.vue';
  import RecentTouchesTile from '../components/dashboard/RecentTouchesTile.vue';
  import TouchesPerHourTile from '../components/dashboard/TouchesPerHourTile.vue';

  export default {
    components: {
      TouchesChart,
      ControlTile,
      RecentTouchesTile,
      TouchesPerHourTile,
    },
    computed: {
      loaded() {
        return this.$store.state.activeTimes !== null
          && this.$store.state.touches !== null;
      },
    },
  };
</script>

<style lang="scss">
  .dashboard {
    max-width: 800px;
    display: grid;
    grid-gap: 16px;
    grid-template-rows: auto auto auto auto;
    grid-template-columns: 1fr;
    grid-template-areas:
      "control"
      "recent-touches"
      "touches-per-hour"
      "touches-chart";

    .control-tile {
      grid-area: control;
    }

    .dashboard-recent-touches-tile {
      grid-area: recent-touches;
    }

    .dashboard-touches-per-hour-tile {
      grid-area: touches-per-hour;
    }

    .dashboard-touches-chart {
      grid-area: touches-chart;
    }

    @media screen and (min-width: 800px) {
      grid-template-rows: auto auto auto;
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
      "control control"
      "recent-touches touches-per-hour"
      "touches-chart touches-chart";
    }
  }
</style>
