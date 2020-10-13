<template>
  <div
    id="app"
    :class="{
      'touching': touching,
      'visible': visible
    }"
  >
    <div class="light">
      <div class="alert">
        Face touching detected!
      </div>
    </div>
    <div class="light-bottom" />
  </div>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    touching: false,
    visible: false,
  }),
  created() {
    window.ipcRenderer.on('set-not-touching', () => {
      this.visible = false;
    });

    window.ipcRenderer.on('set-about-to-touch', () => {
      this.visible = true;
      this.touching = false;
    });

    window.ipcRenderer.on('set-touching', () => {
      this.visible = true;
      this.touching = true;
    });
  },
};
</script>

<style lang="scss">
  body {
    margin: 0;
    overflow: hidden;
  }

  #app {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    --alert-color: #FF8F0077;

    &.touching {
      --alert-color: #FF312E77;
    }

    &.visible {
      .light {
        opacity: 1;
        animation: alternate ease-in-out light 750ms infinite;
      }

      .light-bottom {
        opacity: 1;
      }

      &.touching .alert {
        opacity: 1;
      }
    }
  }

  .light {
    flex-grow: 1;
    opacity: 0;
    transition: opacity 500ms, box-shadow 500ms;
    box-shadow: inset 0 0 3vw 3vw var(--alert-color);
  }

  @keyframes light {
    from {
      box-shadow: inset 0 0 3vw 3vw var(--alert-color);
    }
    to {
      box-shadow: inset 0 0 2vw 2vw var(--alert-color);
    }
  }

  .light-bottom {
    background-color: var(--alert-color);
    height: 56px;
    opacity: 0;
    transition: opacity 500ms;
  }

  .alert {
    margin-top: 128px;
    padding: 32px 48px;
    border: 2px solid #FF312EBB;
    border-radius: 4px;
    background: linear-gradient(0deg, #fff9 0%, #fffb 30%, #fffb 70%, #fff9 100%);
    color: #FF312E;
    font-size: 2em;
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    box-shadow: 0 4px 24px 16px #FF312E33;
    opacity: 0;
    transition: 700ms opacity;
  }
</style>
