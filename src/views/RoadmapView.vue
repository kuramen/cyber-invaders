<template lang="pug">
main
  ul
    li(
      v-for="(step, index) in roadmap"
      :style="{ 'background-image': `url(/img/${step.background}.png)`, transform: `translateX(-${100 * this.activeStepIndex}%)`, left: `${100 * index}%`, color: step.color }"
    )
      h1 {{ step.date }}
      p {{ step.description }}
</template>

<script setup>
import { emitter } from "@/composables/useEvent";
import { ref, onMounted, onUnmounted } from "vue";
import router from "@/router";

const roadmap = ref([
  {
    date: "nov 2k22",
    description:
      "Ceci est la description de l'étape 1, ça va être coooooooooooool !",
    background: "blue-cyber",
    color: "white",
  },
  {
    date: "sep 2k22",
    description: "Et l'étape 2 alors ça va être craaaaaaaaazzzzzzzyyyyyyyy",
    background: "light-city",
    color: "black",
  },
  {
    date: "dec 2k22",
    description: "l'étape 3 j'en parle pas car c'est un truc de dingue",
    background: "purple-cyber",
    color: "white",
  },
  {
    date: "janv 2k23",
    description:
      "Et le meilleur pour la fin, l'étape 4 qui va revolutionner le game",
    background: "punk-city",
    color: "white",
  },
]);
const activeStepIndex = ref(0);

const handleControl = (control) => {
  const isLeft = control === "left";
  switch (control) {
    case "left":
    case "right":
      if (activeStepIndex.value !== (isLeft ? 0 : roadmap.value.length - 1))
        activeStepIndex.value = activeStepIndex.value + (isLeft ? -1 : 1);
      break;
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
main,
ul,
li {
  width: 100%;
  height: 100%;
}

main ul {
  position: relative;
  overflow-x: hidden;

  li {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    background-size: contain;
    transition: all 1s ease;
    padding: 7%;

    h1 {
      height: 20%;
      text-align: center;
      font-family: "Squartiqa", serif;
    }
    p {
      height: 70%;
      font-family: "Minecraft", serif;
      text-align: justify;
    }

    &:first-child::before,
    &:last-child::after {
      display: none;
    }

    &::before,
    &::after {
      position: absolute;
      line-height: 100%;
      top: 50%;
      transform: translateY(-50%);
    }

    &::before {
      content: "◀";
      left: 2%;
    }

    &::after {
      content: "▶";
      right: 2%;
    }
  }
}
</style>
