<template>
  <div class="keyboard-key">
    <div class="keyboard-key__text">
      <slot />
    </div>
    <div class="keyboard-key__shadow" />
  </div>
</template>

<style lang="scss">
  .keyboard-key {
    border: 2px solid black;
    display: inline-flex;
    flex-direction: column;
    background-color: #666;
    border-radius: 6px;
    opacity: 0.9;

    &__text {
      padding: 2px 3px;
      background-color: white;
      border-radius: 4px;
      font-weight: 400;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    &__shadow {
      height: 4px;
    }
  }
</style>
