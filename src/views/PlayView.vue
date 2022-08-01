<template lang="pug">
main
    p.score {{ `SCORE : ${results}/${total}` }}
    .result(v-show="resultSentence") 
      h1(v-show="resultSentence") {{ resultSentence }}
      ul
        li(:class="{ active: !isBack }") Restart
        li(:class="{ active: isBack }") Back
    .grid
        div.square(v-for="squareClass of squares" :class="squareClass")
</template>

<script>
import { emitter } from "@/composables/useEvent";
import router from "@/router";

const squareProps = {
  invader: false,
  shooter: false,
  laser: false,
  boom: false,
};
const width = 10;
const height = 10;
const alienConfig = [2, 4, 6, 13, 15, 22, 24, 26];

export default {
  data() {
    return {
      currentShooterIndex: width * height - Math.floor(width / 2),
      width: width,
      height: height,
      direction: 1,
      invadersId: false,
      goingRight: true,
      results: 0,
      lasers: [],
      debug: false,
      total: Infinity,
      alienInvaders: [],
      squares: Array(width * height)
        .fill(null)
        .map(() => {
          return { ...squareProps };
        }),
      resultSentence: null,
      isBack: 0,
    };
  },
  mounted() {
    emitter.on("control", this.handleControl);
    this.start();
  },
  methods: {
    start() {
      this.squares[this.currentShooterIndex].shooter = false;
      this.squares[this.currentShooterIndex].boom = false;
      for (const i in this.alienInvaders) {
        this.squares[this.alienInvaders[i]].invader = false;
      }

      this.alienInvaders = [...alienConfig];
      this.currentShooterIndex = width * height - Math.floor(width / 2);
      this.total = this.alienInvaders.length;
      this.resultSentence = null;

      this.squares[this.currentShooterIndex].shooter = true;
      for (const i in this.alienInvaders) {
        this.squares[this.alienInvaders[i]].invader = true;
      }

      this.invadersId = setInterval(this.move, 600);
    },
    handleControl(control) {
      if (control === "b") router.replace({ name: "menu" });
      if (this.resultSentence) {
        switch (control) {
          case "left":
          case "right":
            this.isBack = !this.isBack;
            break;
          case "a":
            if (this.isBack) router.replace({ name: "menu" });
            else this.start();
        }
      } else {
        this.shoot(control);
        this.moveShooter(control);
      }
    },
    move() {
      this.moveShooter();
      this.moveLasers();
      this.moveInvaders();
      this.checkEnd();
    },
    moveShooter(control) {
      this.squares[this.currentShooterIndex].shooter = false;
      switch (control) {
        case "left":
          if (this.currentShooterIndex % this.width !== 0)
            this.currentShooterIndex--;
          break;
        case "right":
          if (this.currentShooterIndex % this.width < this.width - 1)
            this.currentShooterIndex++;
          break;
      }
      this.squares[this.currentShooterIndex].shooter = true;
    },
    moveInvaders() {
      const leftEdge = this.alienInvaders[0] % this.width === 0;
      const rightEdge =
        this.alienInvaders[this.alienInvaders.length - 1] % this.width ===
        this.width - 1;

      // Remove all invaders
      for (const i in this.alienInvaders) {
        this.squares[this.alienInvaders[i]].invader = false;
      }

      if (rightEdge && this.goingRight) {
        this.direction = -1;
        this.goingRight = false;
        for (const i in this.alienInvaders) {
          this.alienInvaders[i] += this.width + 1;
        }
      }

      if (leftEdge && !this.goingRight) {
        this.direction = 1;
        this.goingRight = true;
        for (const i in this.alienInvaders) {
          this.alienInvaders[i] += this.width - 1;
        }
      }

      for (const i in this.alienInvaders) {
        this.alienInvaders[i] += this.direction;
      }

      // Draw all invaders
      for (const i in this.alienInvaders) {
        this.squares[this.alienInvaders[i]].invader = true;
      }
    },
    shoot(control) {
      switch (control) {
        case "a":
        case "up":
          if (!this.lasers.includes(this.currentShooterIndex))
            this.lasers.push(this.currentShooterIndex);
      }
    },
    checkEnd() {
      const square = this.squares[this.currentShooterIndex];
      if (square.invader && square.shooter) {
        square.boom = true;
        this.resultSentence = "GAME OVER";
        clearInterval(this.invadersId);
      }

      for (const i in this.alienInvaders) {
        if (this.alienInvaders[i] > this.squares.length) {
          this.resultSentence = "GAME OVER";
          clearInterval(this.invadersId);
        }
      }
      if (this.total === this.results) {
        this.resultSentence = "YOU WIN";
        clearInterval(this.invadersId);
      }
    },
    moveLasers() {
      for (const index in this.lasers) {
        const laserIndex = this.lasers[index];
        const square = this.squares[laserIndex];
        const nextLaserIndex = laserIndex - this.width;
        const nextSquare = this.squares[nextLaserIndex];

        if (square && nextSquare) {
          this.lasers[index] = nextLaserIndex;
          nextSquare.laser = true;
          square.laser = false;
          if (nextSquare.invader) {
            nextSquare.laser = false;
            nextSquare.invader = false;
            nextSquare.boom = true;

            this.lasers.splice(index, 1);
            this.alienInvaders = this.alienInvaders.filter(
              (x) => nextLaserIndex !== x
            );
            this.results++;

            setTimeout(() => (nextSquare.boom = false), 300);
          }
        } else if (square) {
          this.lasers.splice(index, 1);
          square.laser = false;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  background-image: url("/img/night-sky.png");
  background-size: contain;
  padding: 8% 3% 3% 3%;
  position: relative;

  p.score {
    position: absolute;
    font-family: "Minecraft", serif;
    color: white;
    top: 3%;
    right: 3%;
  }

  .result {
    position: absolute;
    width: 100%;
    margin-left: -3%;
    top: 50%;
    text-align: center;
    transform: translateY(-50%);

    h1 {
      font-family: "Squartiqa", serif;
      color: white;
      font-size: 3em;
    }

    ul {
      display: flex;
      justify-content: center;
      gap: 10%;
      flex-direction: row;
      margin-top: 5%;

      li {
        font-size: 1em;
        font-family: "Minecraft", serif;
        color: white;
        position: relative;

        &.active::before {
          position: absolute;
          line-height: 100%;
          top: 50%;
          transform: translateY(-50%);
          content: "▶";
          right: calc(100% + 10px);
        }
      }
    }
  }

  .grid {
    width: 100%;
    height: 100%;
    border: solid purple 4px;
    display: flex;
    flex-wrap: wrap;
  }

  .grid .square {
    width: 10%;
    height: 10%;
    background-size: cover;

    &.invader {
      background-image: url(/img/alien.png);
    }

    &.shooter {
      background-image: url(/img/spaceship.png);
    }

    &.laser {
      background-image: url(/img/laser.png);
    }

    &.boom {
      background-image: url(/img/explosion.png);
    }
  }
}
</style>
