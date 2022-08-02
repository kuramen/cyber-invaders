<template lang="pug">
main
  ul
    li(v-for="member of team")
      h2 {{ member.role }}
      h3(:class="{ 'no-margin': member.noMargin }") {{ member.name }}
  h1 CYBER INVADERS
</template>

<script setup>
import { emitter } from "@/composables/useEvent";
import { ref, onMounted, onUnmounted } from "vue";
import router from "@/router";

const team = ref([
  { role: "General Neo", name: "Project manager, collab' manager" },
  {
    role: "Amiral 0xS",
    name: "Product designer, NFT expert and digger, BAYC holder",
  },
  { role: "Caporal Kuramen", name: "Developper" },
  { role: "Officer X", name: "Designer", noMargin: true },
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
    font-size: 1.6em;
  }

  h2,
  h3 {
    font-family: "Minecraft", serif;
    color: black;
  }

  h2 {
    font-size: 1.3em;
  }

  h3 {
    font-size: 1em;
    margin-top: 0.5%;
    margin-bottom: 2%;

    &.no-margin {
      margin-bottom: 0%;
    }
  }
}
</style>
