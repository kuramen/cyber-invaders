<template lang="pug">
main
  ul
    li(v-for="member of team")
      h2 {{ member.role }}
      h3 {{ member.name }}
  h1 CYBER INVADERS
</template>

<script setup>
import { emitter } from "@/composables/useEvent";
import { ref, onMounted, onUnmounted } from "vue";
import router from "@/router";

const team = ref([
  { role: "DEV", name: "Kuramen" },
  { role: "DEV", name: "Kuramen" },
  { role: "DEV", name: "Kuramen" },
]);

const handleControl = (control) => {
  switch (control) {
    case "b":
      router.replace({ name: "menu" });
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
  background-image: url("/img/green-city.png");
  background-size: cover;

  h1 {
    font-family: "Squartiqa", serif;
    color: black;
  }

  h2,
  h3 {
    font-family: "Minecraft", serif;
    color: black;
  }
}
</style>
