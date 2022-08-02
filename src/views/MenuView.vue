<template lang="pug">
main
  h1 CYBER INVADERS
  nav
    ul
      li(
        v-for="(label, index) in labels"
        :class="{ active: index === activeLinkIndex }"
        @mouseover="activeLinkIndex = index"
      ) 
        router-link(:to=" `/${label}`") {{ label.toUpperCase() }}
</template>

<script setup>
import { emitter } from "@/composables/useEvent";
import { ref, onMounted, onUnmounted } from "vue";
import router from "@/router";

const labels = ref(["play", "manifesto", "roadmap", "faq", "credits"]);
const activeLinkIndex = ref(0);

const handleControl = (control) => {
  const isUp = control === "up";
  switch (control) {
    case "up":
    case "down":
      if (activeLinkIndex.value === (isUp ? 0 : labels.value.length - 1))
        activeLinkIndex.value = isUp ? labels.value.length - 1 : 0;
      else activeLinkIndex.value = activeLinkIndex.value + (isUp ? -1 : 1);
      break;
    case "a":
      router.replace({ name: labels.value[activeLinkIndex.value] });
      break;
  }
};

onMounted(() => {
  emitter.on("control", handleControl);
});

onUnmounted(() => {
  emitter.off("control", handleControl);
});
</script>

<style lang="scss" scoped>
$gap: 5%;

main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  gap: $gap;
  background-image: url("/img/black-galaxy.png");
  background-size: contain;

  h1 {
    font-family: "Squartiqa", serif;
    color: pink;
  }

  nav ul li {
    color: pink;
    font-family: "Minecraft", serif;
    position: relative;
    width: fit-content;
    margin: auto;
    margin-bottom: calc($gap / 4);

    &.active {
      &::before,
      &::after {
        position: absolute;
        line-height: 100%;
        top: 50%;
        transform: translateY(-50%);
      }

      &::before {
        content: "\25B6\FE0E";
        right: calc(100% + 20px);
      }

      &::after {
        content: "\25C0\FE0E";
        left: calc(100% + 20px);
      }
    }
  }
}
</style>
