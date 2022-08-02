<template lang="pug">
main
  .section(v-for="(section, sectionIndex) in sections" :class="[{'with-cursor': displayCursor }, section.name]" v-show="sectionIndex === activeSectionIndex")
    h1 {{ section.name }}
    p(
      v-for="(paragraph, paragraphIndex) of section.paragraphs"
      v-dialog
      :data-text="(paragraphIndex <= activeParagraphIndex && sectionIndex === activeSectionIndex) ? paragraph.text : ''"
      :data-displayed="paragraph.displayed"
    )
</template>

<script setup>
import { emitter } from "@/composables/useEvent";
import { ref, onMounted, onUnmounted } from "vue";
import router from "@/router";
import vDialog from "@/directives/DialogDirective";

const sections = ref([
  {
    name: "project",
    paragraphs: [
      {
        text: "Cyber Invaders is an exclusive collection of 3,333 NFTs, launched on the Solana blockchain by a top team of NFT collectors, designers, artist and community builders.",
        displayed: false,
      },
      {
        text: "With Cyber Invaders, we first want to create a strong community of investors and Solana NFT supporters, who will be able to meet each other in our Discord server.",
        displayed: false,
      },
    ],
  },
  {
    name: "history",
    paragraphs: [
      {
        text: "In the year 2140, Cyber Invaders inhabit live on one of the hundreds of planets colonized by humans. However, the Earth has disappeared in an apocalyptic catastrophe.",
        displayed: false,
      },
      {
        text: "On their planet, the Cyber Invaders have obtained signs of life from Earth thanks to signals sent from the Solana blockchain. That's why they send 3,333 Invaders to invade the earth and save the Solana blockchain.",
        displayed: false,
      },
    ],
  },
  {
    name: "history",
    paragraphs: [
      {
        text: "Among the 3333 Invaders, there are 50% men and % women. At least, that was the case at the beginning. During the initial invasion training, several Invaders found themselves affected. Some came back unchanged, but some got stuck in the Matrix of the Solana blockchain, others turned into Aliens, and others joined the ranks of the robots.",
        displayed: false,
      },
    ],
  },
  {
    name: "adventure",
    paragraphs: [
      {
        text: "A great journey is about to begin for Cyber Invaders.",
        displayed: false,
      },
      {
        text: "There are many paths that lead to an infinity of different history. Each Invaders will become the creator of his own destiny. 3,333 Cyber Invaders, 3,333 different paths, 1 single objective: to be the first to set foot on the world of Solana. Make the right choices and you will emerge victorious.",
        displayed: false,
      },
    ],
  },
  {
    name: "adventure",
    paragraphs: [
      {
        text: "There are 3 paths that will lead you to 3 different stories. At the beginning, you will have a choice to make from 3 options, which will determine which path you take. Each (delisted) Cyber Invaders will be eligible to take all three paths, one at a time. At the end of each path, you will receive a part of the ship that will lead you to the Solana blockchain.",
        displayed: false,
      },
    ],
  },
  {
    name: "adventure",
    paragraphs: [
      {
        text: "On your way, you will have several missions to complete. Each mission will be a free mint for the holders, acting as a certificate of achievement. Once you have completed all your missions, you will receive one of the 3 pieces of the ship. But this one, alone, will not be a sufficient element to allow you to go on the Solana blockchain.",
        displayed: false,
      },
    ],
  },
  {
    name: "adventure",
    paragraphs: [
      {
        text: "The 3 paths are not part of the same story. Once your 1st path is selected, only a special NFT will give you the possibility to change path. This NFT is a time travel zapper, it is single use and will be minable only when you have completed your 1st path. Don't worry, it will also be possible to get it in the secondary market places.",
        displayed: false,
      },
      {
        text: "Those who have managed to gather the three parts of the ship will have the possibility to choose the destiny of their Cyber Invaders. Three mutations will be offered, which will remain secret until one of you manages to unlock it. Once again, the mint is not the only way to get a ship part, it is also possible to buy them on the secondary market.",
        displayed: false,
      },
    ],
  },
  {
    name: "adventure",
    paragraphs: [
      {
        text: "Those who have managed to gather the three parts of the ship will have the possibility to choose the destiny of their Cyber Invaders. Three mutations will be offered, which will remain secret until one of you manages to unlock it. Once again, the mint is not the only way to get a ship part, it is also possible to buy them on the secondary market.",
        displayed: false,
      },
    ],
  },
]);

const activeSectionIndex = ref(0);
const activeParagraphIndex = ref(0);
const displayCursor = ref(false);

emitter.on("displayed", () => {
  displayCursor.value = true;
});

const handleControl = (control) => {
  const paragraphs = sections.value[activeSectionIndex.value]?.paragraphs;
  switch (control) {
    case "a":
      if (activeParagraphIndex.value < paragraphs.length - 1) {
        if (!paragraphs[activeParagraphIndex.value].displayed) {
          displayCursor.value = true;
          paragraphs[activeParagraphIndex.value].displayed = true;
        } else {
          displayCursor.value = false;
          activeParagraphIndex.value++;
        }
      } else if (
        activeParagraphIndex.value === paragraphs.length - 1 &&
        activeSectionIndex.value < sections.value.length - 1
      ) {
        if (!paragraphs[activeParagraphIndex.value].displayed) {
          displayCursor.value = true;
          paragraphs[activeParagraphIndex.value].displayed = true;
        } else {
          displayCursor.value = false;
          activeParagraphIndex.value = 0;
          activeSectionIndex.value++;
        }
      } else {
        if (!paragraphs[activeParagraphIndex.value].displayed) {
          displayCursor.value = true;
          paragraphs[activeParagraphIndex.value].displayed = true;
        } else {
          router.replace({ name: "menu" });
        }
      }
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
$gap: 5%;

@keyframes flickerAnimation {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  gap: $gap;
  background-image: url(@/assets/img/blue-city.png);
  background-size: cover;

  .section {
    padding: 4%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: relative;

    h1 {
      font-family: "Squartiqa", serif;
      font-size: 1.8em;
      color: black;
    }

    p {
      font-family: "Minecraft", serif;
      font-size: 1em;
      text-align: justify;
      text-indent: 6%;
    }

    &::after {
      display: none;
      position: absolute;
      bottom: 2%;
      right: 5%;
      content: "\25BC\FE0E";
      animation: flickerAnimation 0.5s infinite;
    }
    &.with-cursor::after {
      display: block;
    }
  }
}
</style>
