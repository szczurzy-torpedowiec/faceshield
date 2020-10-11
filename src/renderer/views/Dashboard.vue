<template>
  <div class="px-4 py-2 dashboard">
    <control-tile />
    <recent-touches-tile />
    <touches-per-hour-tile />
  </div>
</template>

<script>
  import ControlTile from "../components/dashboard/ControlTile";
  import RecentTouchesTile from "../components/dashboard/RecentTouchesTile";
  import TouchesPerHourTile from "../components/dashboard/TouchesPerHourTile"

  export default {
    components: {
      ControlTile,
      RecentTouchesTile,
      TouchesPerHourTile,
    }
  }
</script>

<style lang="scss">
  .dashboard {
    display: grid;
    grid-gap: 16px;
    grid-template-rows: auto auto auto;
    grid-template-columns: 1fr;
    grid-template-areas:
      "control"
      "recent-touches"
      "touches-per-hour";

    .dashboard-control-tile {
      grid-area: control;
    }

    .dashboard-recent-touches-tile {
      grid-area: recent-touches;
    }

    .dashboard-touches-per-hour-tile {
      grid-area: touches-per-hour;
    }

    @media screen and (min-width: 800px) {
      grid-template-rows: auto auto;
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
      "control control"
      "recent-touches touches-per-hour";
    }
  }
</style>
