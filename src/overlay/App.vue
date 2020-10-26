<template>
  <div
    id="app"
    :class="{
      'touching': touching,
    }"
  >
    <div class="light">
      <div class="alert">
        <div class="alert__body">
          Face touching detected!
        </div>
        <template v-if="shortcutEnabled">
          <div class="alert__divider" />
          <div class="alert__remove">
            Press <keyboard-key>ctrl</keyboard-key>
            + <keyboard-key>alt</keyboard-key>
            + <keyboard-key>f</keyboard-key>
            to remove from history
          </div>
        </template>
      </div>
    </div>
    <div class="light-bottom" />
  </div>
</template>

<script>
  import KeyboardKey from './components/KeyboardKey.vue';
  import ding from '../assets/face-touch-ding.wav';

  export default {
    name: 'App',
    components: { KeyboardKey },
    data: () => ({
      touching: false,
      audio: new Audio(ding),
      shortcutEnabled: null,
    }),
    async created() {
      window.ipcRenderer.on('overlay:set-touching', (event, touching) => {
        this.touching = touching;
      });
      window.ipcRenderer.on('overlay:ding', (event, { volume }) => {
        this.audio.volume = volume;
        this.audio.currentTime = 0;
        this.audio.play();
      });
      window.ipcRenderer.on('overlay:shortcut-enabled-changed', (event, enabled) => {
        this.shortcutEnabled = enabled;
      });
      this.shortcutEnabled = await window.ipcRenderer.invoke('overlay:get-shortcut-enabled');
    },
  };
</script>

<style lang="scss">
  $alert-color: #FF312E77;

  body, html {
    margin: 0;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    box-sizing: border-box;
  }

  #app {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;

    &.touching {
      .light {
        opacity: 1;
        animation: alternate ease-in-out light 750ms infinite;
      }

      .light-bottom {
        opacity: 1;
      }
    }
  }

  .light {
    flex-grow: 1;
    opacity: 0;
    transition: opacity 500ms, box-shadow 500ms;
    box-shadow: inset 0 0 3vw 3vw $alert-color;
  }

  @keyframes light {
    from {
      box-shadow: inset 0 0 3vw 3vw $alert-color;
    }
    to {
      box-shadow: inset 0 0 2vw 2vw $alert-color;
    }
  }

  .light-bottom {
    background-color: $alert-color;
    height: 56px;
    opacity: 0;
    transition: opacity 500ms;
  }

  .alert {
    margin-top: 128px;
    border: 2px solid #FF312EBB;
    border-radius: 4px;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0 4px 24px 16px #FF312E33;
    text-align: center;

    &__body {
      background: linear-gradient(0deg, #fff9 0%, #fffb 30%, #fffb 70%, #fff9 100%);
      font-family: 'Roboto', sans-serif;
      color: #FF312E;
      font-size: 2em;
      font-weight: 300;
      padding: 32px 48px;
    }

    &__divider {
      background-color: #FF312EBB;
      height: 2px;
      width: 100%;
    }

    &__remove {
      background-color: #fff9;
      font-family: 'Roboto', sans-serif;
      font-weight: 400;
      font-size: 1.1em;
      padding: 8px 24px;
    }
  }
</style>
