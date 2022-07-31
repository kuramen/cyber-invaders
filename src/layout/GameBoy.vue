<template lang="pug">
.game-boy
  .cartridge-container
    span
    span
    span

  .screen-container
    h4.description DOT MATRIX WITH STEREO SOUND
    
    .battery-indicator
      span.light
      h4 BATTERY

    .screen
      slot

  .title
    h2 Solana
    h1 CYBER GAME
    h3 TM

  DirectionalPad
  action-button(type="a")
  action-button(type="b")
  action-button(type="select")
  action-button(type="start")

  .speaker
    span
    span
    span
    span
    span
    span
</template>

<script setup>
import DirectionalPad from "@/components/DirectionalPad.vue";
import ActionButton from "@/components/ActionButton.vue";
import { emitter } from "@/composables/useEvent";
import { onMounted } from "vue";

onMounted(() => {
  document.addEventListener("keydown", ({ code }) => {
    let control;
    switch (code) {
      case "ArrowLeft":
        control = "left";
        break;
      case "ArrowUp":
        control = "up";
        break;
      case "ArrowDown":
        control = "down";
        break;
      case "ArrowRight":
        control = "right";
        break;
      case "KeyQ":
      case "KeyA":
      case "Enter":
        control = "a";
        break;
      case "KeyB":
      case "Backspace":
        control = "b";
        break;
      case "ControlLeft":
      case "ControlRight":
        control = "start";
        break;
      case "AltLeft":
      case "AltRight":
        control = "select";
        break;
    }
    if (control) emitter.emit("control", control);
  });
});
</script>

<style lang="scss">
.game-boy {
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: calc(-750px / 2);
  margin-left: calc(-490px / 2);
  border-radius: 25px;
  border-bottom-right-radius: 100px;
  height: 750px;
  width: 490px;
  min-height: 750px;
  min-width: 490px;
  background-color: $game-boy-primary-color;

  @media screen and (max-width: 410px) {
    transform: scale(0.8);
  }

  @media screen and (min-width: 410px) and (max-width: 500px) {
    transform: scale(0.9);
  }

  @media screen and (min-width: 410px) and (max-width: 500px) {
    transform: scale(0.9);
  }

  @media screen and (min-width: 800px) {
    transform: scale(1.1);
  }

  .screen-container {
    position: absolute;
    background-color: $game-boy-secondary-color;
    display: inline-block;
    top: 1%;
    left: 2%;
    right: 2%;
    height: 45%;
    border-radius: 25px;
    border-bottom-right-radius: 50px;
    padding: 17px;

    h4 {
      font-size: 0.6em;
      font-family: "Bitstream Vera Sans";
      color: $game-boy-secondary-title-color;

      &.description {
        text-align: center;
        vertical-align: middle;
        width: 100%;
        height: 15px;
        line-height: 17px;
        margin-bottom: 2%;

        &::before,
        &::after {
          display: inline-block;
          content: "";
          vertical-align: middle;
          height: 85%;
          border-top: 2px solid $game-boy-primary-button-color;
          border-bottom: 2px solid $game-boy-primary-title-color;
        }

        &::before {
          width: 40%;
          float: left;
        }

        &::after {
          width: 15%;
          float: right;
        }
      }
    }

    .battery-indicator {
      display: inline-block;
      width: 10%;
      height: 100%;
      margin-top: 20%;
      vertical-align: top;

      .light {
        display: block;
        background-color: red;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        margin: auto;
        margin-bottom: 10px;
      }
    }

    .screen {
      display: inline-block;
      background-color: $game-boy-screen-color;
      width: 75%;
      margin: 0 10% 0 5%;
      height: calc(95% - 15px);
      border-radius: 15px;
      overflow: hidden;
    }
  }

  .directional-pad {
    position: absolute;
    top: 55%;
    left: 7%;
  }

  button.a {
    position: absolute;
    top: 57%;
    right: 7%;
  }

  button.b {
    position: absolute;
    top: 62%;
    right: 23%;
  }

  button.start {
    position: absolute;
    bottom: 15%;
    left: 37%;
  }

  button.select {
    position: absolute;
    bottom: 15%;
    right: 37%;
  }

  .title {
    position: absolute;
    color: $game-boy-primary-title-color;
    left: 2%;
    top: 46%;

    h1,
    h2,
    h3 {
      display: inline-block;
    }

    h1 {
      font-size: 34px;
      font-weight: 900;
      font-family: "Arial Black Italic";
    }

    h2,
    h3 {
      font-family: "Bitstream Vera Sans";
    }

    h2 {
      font-size: 29px;
    }

    h3 {
      font-size: 16px;
    }
  }
}
</style>
