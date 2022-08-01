<template lang="pug">
game-boy
  router-view
</template>

<script>
import GameBoy from "@/layout/GameBoy.vue";

export default {
  components: { GameBoy },
  created() {
    // Disable pinch to zoom
    document.addEventListener('touchmove', function (event) {
      if (event.scale !== 1) { event.preventDefault(); }
    }, false);

    // Disable double tap zoom
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }
};
</script>
