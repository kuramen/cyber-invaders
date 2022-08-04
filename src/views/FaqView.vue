<template lang="pug">
main
  .questions
    .cyber-dialog
      p(v-dialog :data-text="cyberSpeech" :data-displayed="cyberSpeechIsDisplayed" @click="handleControl('a')")
    .cyber-invader
      img(alt="cyber-invader" src="@/assets/img/cyber-invader.png")
  .dialog
    ul(v-show="isCyberAskingQuestion && cyberSpeechIsDisplayed")
      li(
        v-for="(dialog, index) in dialogs"
        :class="{ active: index === activeQuestionIndex }"
        @mouseover="activeQuestionIndex = index"
        @click="handleControl('a')"
      ) {{ dialog.question }}
    p.response(
      v-show="!isCyberAskingQuestion"
      v-dialog
      :data-text="answer"
      :data-displayed="isCyberAskingQuestion || answerIsDisplayed"
      :class="{ large: answer.length > 290 }"
      @click="handleControl('a')"
    )
</template>

<script setup>
import { emitter } from "@/composables/useEvent";
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import router from "@/router";
import vDialog from "@/directives/DialogDirective";

const firstQuestion = "Hi cyber invader, how can I help you ?";
const nextQuestion = "Do you have an other question ?";
const cyberSpeech = ref(firstQuestion);
const isCyberAskingQuestion = computed(
  () =>
    cyberSpeech.value === firstQuestion || cyberSpeech.value === nextQuestion
);
const cyberSpeechIsDisplayed = ref(false);

const activeQuestionIndex = ref(0);
const dialogs = ref([
  {
    question: "How can I join the presale ?",
    answer:
      "To join our presale, you must reach the rank of Cyber Captain (OG) or Cyber Soldiers (WL).",
  },
  {
    question: "Why should I mint a Cyber Invader ?",
    answer:
      "Beyond owning one of the most magnificent pieces of artwork in the NFT ecosystem on Solana, owning a Cyber Invaders will allow you to participate in one of the craziest missions of your life: invading the Solana blockchain. You will participate in various missions, mint NFTs until the final goal...",
  },
  {
    question: "Where can I buy the NFT ?",
    answer: "There will be (no more, no less) 3,333 NFTs in the collection.",
  },
  {
    question: "How many Cyber Invaders will participate in the invasion ?",
    answer: "The collection consists of 3333 cyber invaders.",
  },
  {
    question: "How much will the mint cost ?",
    answer:
      "For the pre-sale, the price per mint will be 0,15 SOL. For the public sale, the price of the mint will be 0,3 SOL.",
  },
  {
    question: "When can I mint my NFT ?",
    answer: "The mint date will be announced soon.",
  },
]);
const answerIsDisplayed = ref(false);
const answer = ref("");

emitter.on("displayed", () => {
  if (isCyberAskingQuestion.value) {
    cyberSpeechIsDisplayed.value = true;
  } else {
    answerIsDisplayed.value = true;
  }
});

watch(isCyberAskingQuestion, (value) => {
  if (value) {
    answer.value = "";
    answerIsDisplayed.value = false;
    cyberSpeechIsDisplayed.value = false;
  } else {
    answer.value = dialogs.value[activeQuestionIndex.value].answer;
  }
});

const handleControl = (control) => {
  const isUp = control === "up";
  const dialog = dialogs.value[activeQuestionIndex.value];
  if (isCyberAskingQuestion.value) {
    switch (control) {
      case "up":
      case "down":
        if (activeQuestionIndex.value === (isUp ? 0 : dialogs.value.length - 1))
          activeQuestionIndex.value = isUp ? dialogs.value.length - 1 : 0;
        else activeQuestionIndex.value += isUp ? -1 : 1;
        break;
      case "a":
        if (!cyberSpeechIsDisplayed.value) {
          cyberSpeechIsDisplayed.value = true;
        } else {
          cyberSpeech.value = dialog.question;
        }
        break;
      case "b":
        router.replace({ name: "menu" });
        break;
    }
  } else {
    switch (control) {
      case "a":
        if (!answerIsDisplayed.value) {
          answerIsDisplayed.value = true;
        } else {
          cyberSpeech.value = nextQuestion;
        }
        break;
      case "b":
        router.replace({ name: "menu" });
        break;
    }
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
  gap: $gap;
  background-image: url(@/assets/img/purple-city.png);
  background-size: cover;

  .questions {
    display: flex;
    flex-direction: row;
    justify-content: space-around;

    .cyber-dialog,
    .cyber-invader {
      width: 40%;
      height: 100%;
    }

    .cyber-dialog p {
      font-family: "Minecraft", serif;
      margin: 2%;
      font-size: 0.9em;
    }

    .cyber-invader {
      background-image: url(@/assets/img/green-cyber.png);
      background-size: cover;
      img {
        width: auto;
        display: block;
        margin: 0 auto;
        height: 100%;
      }
    }
  }

  .questions,
  .dialog {
    height: 40%;
  }

  .dialog,
  .cyber-dialog,
  .cyber-invader {
    background-color: rgba(0, 0, 0, 0.5);
    border: 0.3em solid rgba(128, 0, 128, 0.5);
    color: white;
  }

  .dialog {
    width: 90%;
    margin: 0 auto;
    font-family: "Minecraft", serif;
    font-size: 0.8em;

    ul {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 100%;

      li {
        position: relative;
        width: fit-content;
        margin-left: 8%;
        text-align: left;

        &.active::before {
          content: "\25B6\FE0E";
          position: absolute;
          line-height: 100%;
          top: 50%;
          right: calc(100% + 10px);
          transform: translateY(-50%);
        }
      }
    }

    p {
      margin: 2%;
      text-align: justify;
      font-size: 1.1em;

      &.large {
        font-size: 0.9em;
      }
    }
  }
}
</style>
