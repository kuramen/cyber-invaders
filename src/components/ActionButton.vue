<template lang="pug">
button(:class="[ type ]" @click="sendType")
    label {{ type.toUpperCase() }}
</template>

<script>
import { emitter } from "@/composables/useEvent";

export default {
  name: "DirectionalPad",
  props: ["type"],
  methods: {
    sendType() {
      emitter.emit("control", this.type);
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  width: $button-size;
  transform: rotate(-15deg);
  cursor: pointer;

  &.a,
  &.b {
    background-color: $game-boy-primary-button-color;
    border-radius: 50%;
    height: $button-size;

    label {
      font-size: 23px;
      font-family: "Arial Black";
      color: $game-boy-primary-title-color;
      top: 80%;
      left: 0%;
    }
  }

  &.select,
  &.start {
    background-color: $game-boy-secondary-button-color;
    border-radius: calc($button-size / 5);
    height: calc($button-size / 3);

    label {
      font-size: 14px;
      font-family: "Bitstream Vera Sans";
      color: $game-boy-primary-title-color;
      top: 150%;
    }
  }

  label {
    display: block;
    position: relative;
  }
}
</style>
