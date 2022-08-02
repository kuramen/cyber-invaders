<template lang="pug">
main
  ul
    li(
      v-for="(step, index) in roadmap"
      :style="{ 'background-image': `url(/img/${step.background}.png)`, transform: `translateX(-${100 * activeStepIndex}%)`, left: `${100 * index}%`, color: step.color }"
      :id="`step-${index}`"
    )
      h1(
        :id="`step-${index}-h1`"
        :style="{ transform: `translateY(${step.scroll}px)` }"
      ) {{ step.date }}
      h2(:style="{ transform: `translateY(${step.scroll}px)` }") {{ step.title }}
      p(
        v-for="(paragrah, i) of step.paragraphs"
        :style="{ transform: `translateY(${step.scroll}px)` }"
        :id="`step-${index}-p-${i}`"
      ) {{ paragrah }}
</template>

<script setup>
import { emitter } from "@/composables/useEvent";
import { ref, onMounted, onUnmounted } from "vue";
import router from "@/router";

const roadmap = ref([
  {
    date: "June 2022",
    title: "Building community",
    paragraphs: [
      "A Cyber Invasion cannot be organized without an army of Invaders.",
      "That's why we're building our community quietly, organically, by trying to gather the most active members of the Solana ecosystem. Moreover, we have built a team of passionate moderators and helpers who help us answer your requests 24 hours a day, via a ticketing system and on our Discord.",
      "It also goes with Doxx & transparancy. We are completely transparent on our profiles and our team has been doxxed. We will reveal our identity and present our stories later in our roadmap. All this will be exclusively accessible on our Discord.",
    ],
    background: "blue-cyber",
    color: "white",
    scroll: 0,
  },
  {
    date: "August 2022",
    title: "Minting",
    paragraphs: [
      "Our army is finally built. We have assembled a team of Cyber Captain (OG) and Cyber Soldiers (WL) as well as some Cyber Mercenaries ready to join the troops in public.",
      "We will start the sale with the presale to reward our OG and early supporters. Then, it will be the turn of the WL sale, valiant soldiers who have shown their courage and strength. Finally, we will proceed to the public mint which will allow to complete our ranks. The Cyber Invasion will then begin.",
      "The presale will allow you to get a place for the mint, at a lower price and before everyone else.",
    ],
    background: "light-city",
    color: "black",
    scroll: 0,
  },
  {
    date: "October 2022",
    title: "Staking",
    paragraphs: [
      "Once our staking platform is available, you can lock your NFT and start the adventure.",
      "To begin, you will receive an airdrop from an NFT corresponding to your planet. This will determine the difficulty of your adventure and the path you will take at the start.",
      "In a few words, you will have three different paths. Your goal will be to get an NFT from a piece of the ship that will allow you to leave your planet and invade the Solana blockchain. Don't panic, you will be able to mine an NFT to complete the missions of the 2 other paths or directly mine the final NFT from the piece of the ship.",
      "Once the 3 pieces are recovered, you will be able to burn these 3 NFTs and get a modified version of your NFT. This one will be part of an alternative and mutated collection of your NFTs. You will know more about it later.",
    ],
    background: "purple-cyber",
    color: "white",
    scroll: 0,
  },
  {
    date: "December 2022",
    title: "Other collections released",
    paragraphs: [
      "Let's keep growing our ranks !",
      "Once the first players have successfully completed their missions, we will open the collection of mutated NFTs to others. A new collection of Cyber Invaders will then begin.",
    ],
    background: "punk-city",
    color: "white",
    scroll: 0,
  },
  {
    date: "December 2022",
    title: "What’s next ?",
    paragraphs: [
      "All this will happen before the end of 2022. But what does 2023 hold for us?",
      "You know as well as we do, broken roadmaps are the biggest problem that usually leads to the death of projects. We don't want to promise you anything that we are not sure we can deliver. Everything that is mentioned can be achieved with the funds provided by the team.",
      "The project will continue to develop with the funds raised during the mint. We are full of ideas, and we are ready to treat you. The rest is coming soon.",
    ],
    background: "gray-city",
    color: "black",
    scroll: 0,
  },
]);
const activeStepIndex = ref(0);

const isOutside = (parentSelector, childSelector) => {
  const parentDiv = document.getElementById(parentSelector);
  const childDiv = document.getElementById(childSelector);
  const parentRect = parentDiv.getBoundingClientRect();
  const childRect = childDiv.getBoundingClientRect();

  return (
    parentRect.bottom <= childRect.bottom || parentRect.top >= childRect.top
  );
};

const handleControl = (control) => {
  const isLeft = control === "left";
  switch (control) {
    case "left":
    case "right":
      if (activeStepIndex.value !== (isLeft ? 0 : roadmap.value.length - 1))
        activeStepIndex.value = activeStepIndex.value + (isLeft ? -1 : 1);
      scroll.value = 0;
      break;
    case "down":
      if (
        isOutside(
          `step-${activeStepIndex.value}`,
          `step-${activeStepIndex.value}-p-${
            roadmap.value[activeStepIndex.value].paragraphs.length - 1
          }`, true
        )
      )
        roadmap.value[activeStepIndex.value].scroll -= 10;
      break;
    case "up":
      if (
        isOutside(
          `step-${activeStepIndex.value}`,
          `step-${activeStepIndex.value}-h1`
        )
      )
        roadmap.value[activeStepIndex.value].scroll += 10;
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
    position: absolute;
    background-size: cover;
    transition: all 1s ease;
    padding: 8%;
    overflow: hidden;

    h1 {
      font-size: 1.5em;
      text-align: center;
      font-family: "Squartiqa", serif;
    }

    h2 {
      font-family: "Minecraft", serif;
      font-size: 1.2em;
      text-align: center;
      margin-bottom: 3%;
    }

    p {
      font-family: "Minecraft", serif;
      text-align: justify;
      font-size: 0.8em;
      text-indent: 8%;
      margin-bottom: 2%;
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
      content: "\25C0\FE0E";
      left: 2%;
    }

    &::after {
      content: "\25B6\FE0E";
      right: 2%;
    }
  }
}
</style>
