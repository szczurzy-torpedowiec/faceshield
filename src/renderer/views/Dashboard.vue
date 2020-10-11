<template>
  <div class="px-4 py-2 dashboard">
    <control-tile />
    <recent-touches-tile />
  </div>
</template>

<script>
  import ControlTile from "../components/dashboard/ControlTile";
  import RecentTouchesTile from "../components/dashboard/RecentTouchesTile";

  export default {
    components: {
      RecentTouchesTile,
      ControlTile,
    }
  }
</script>

<style lang="scss">
  .dashboard {
    display: grid;
    grid-gap: 16px;
    grid-template-rows: auto auto;
    grid-template-columns: 1fr;
    grid-template-areas:
      "control"
      "recent-touches";

    .dashboard-control-tile {
      grid-area: control;
    }

    .dashboard-recent-touches-tile {
      grid-area: recent-touches;
    }

    @media screen and (min-width: 800px) {
      grid-template-rows: auto auto;
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
      "control control"
      "recent-touches .";
    }
  }
</style>
