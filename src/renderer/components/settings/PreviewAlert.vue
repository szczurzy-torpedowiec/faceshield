<template>
  <v-expand-transition>
    <div v-if="value">
      <v-divider />
      <v-alert
        text
        tile
        :color="color"
        :icon="icon"
        class="my-0"
      >
        <slot />
      </v-alert>
    </div>
  </v-expand-transition>
</template>

<script>
  export default {
    props: {
      value: {
        default: true,
        type: Boolean,
      },
      icon: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: false,
        default: undefined,
      },
    },
  };
</script>
