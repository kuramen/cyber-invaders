<template lang="pug">
main
  .questions
    .cyber-dialog
      p(v-dialog :data-text="cyberSpeech" :data-displayed="cyberSpeechIsDisplayed")
    .cyber-invader
      img(alt="cyber-invader" src="/img/cyber-invader.png")
  .dialog
    ul(v-show="isCyberAskingQuestion && cyberSpeechIsDisplayed")
      li(
        v-for="(dialog, index) in dialogs"
        :class="{ active: index === activeQuestionIndex }"
      ) {{ dialog.question }}
    p.response(v-show="!isCyberAskingQuestion" v-dialog :data-text="answer" :data-displayed="isCyberAskingQuestion || answerIsDisplayed")
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
      "To join our presale you must earn the rank of Boatswain (WL2), Chiefmate (WL1) or Corsair (WL1).",
  },
  {
    question: "Why should I mint a cyber invader ?",
    answer:
      "Besides having the coolest PFP in the NFT space, holding a Lost Pirates will give you immediate access to AR-powered treasure hunts with prizes in SOL and extensive/exclusive artistic content.",
  },
  {
    question: "Where can I buy the NFT ?",
    answer: "The collection will be launched exclusively on Magic Eden.",
  },
  {
    question: "How big is the collection ?",
    answer: "The collection consists of 3333 cyber invaders.",
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
  background-image: url("/img/purple-city.png");
  background-size: contain;

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
      background-image: url("/img/green-cyber.png");
      background-size: contain;
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
          content: "▶";
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
    }
  }
}
</style>
