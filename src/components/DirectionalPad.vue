<template lang="pug">
.directional-pad
    button.center ●
    button.left(@click="sendLeft") ◀
    button.up(@click="sendUp") ▲
    button.right(@click="sendRight") ▶
    button.down(@click="sendDown") ▼
</template>

<script>
import { emitter } from "@/composables/useEvent";

export default {
  name: "DirectionalPad",
  methods: {
    sendLeft() {
      emitter.emit("control", "left");
    },
    sendRight() {
      emitter.emit("control", "right");
    },
    sendUp() {
      emitter.emit("control", "up");
    },
    sendDown() {
      emitter.emit("control", "down");
    },
  },
};
</script>

<style lang="scss">
.directional-pad {
  display: block;
  width: calc($button-size * 3);
  height: calc($button-size * 3);

  button {
    display: block;
    position: relative;
    background-color: $game-boy-secondary-button-color;
    color: black;
    width: $button-size;
    height: $button-size;
    cursor: pointer;

    &.center {
      left: $button-size;
      top: $button-size;
    }

    &.left {
      left: 0%;
      top: 0%;
      border-top-left-radius: calc($button-size / 5);
      border-bottom-left-radius: calc($button-size / 5);
    }

    &.up {
      top: -$button-size * 2;
      left: $button-size;
      border-top-left-radius: calc($button-size / 5);
      border-top-right-radius: calc($button-size / 5);
    }

    &.right {
      top: -$button-size * 2;
      left: $button-size * 2;
      border-top-right-radius: calc($button-size / 5);
      border-bottom-right-radius: calc($button-size / 5);
    }

    &.down {
      top: -$button-size * 2;
      left: $button-size;
      border-bottom-right-radius: calc($button-size / 5);
      border-bottom-left-radius: calc($button-size / 5);
    }
  }
}
</style>
