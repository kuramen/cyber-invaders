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
import invaderKilledAudio from "@/assets/sound/invaderKilled.mp3";
import shootAudio from "@/assets/sound/shoot.mp3";
import winAudio from "@/assets/sound/win.mp3";
import gameOverAudio from "@/assets/sound/gameOver.mp3";

const squareProps = {
  invader: false,
  shooter: false,
  laser: false,
  boom: false,
};
const width = 10;
const height = 10;
const alienConfig = [2, 4, 6, 13, 15, 22, 24, 26];

const invaderKilled = new Audio(invaderKilledAudio);
const shoot = new Audio(shootAudio);
const win = new Audio(winAudio);
const gameOver = new Audio(gameOverAudio);

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
      isBack: false,
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
      for (const i in this.lasers) {
        this.squares[this.lasers[i]].laser = false;
      }

      this.alienInvaders = [...alienConfig];
      this.currentShooterIndex = width * height - Math.floor(width / 2);
      this.lasers = [];
      this.total = this.alienInvaders.length;
      this.results = 0;
      this.resultSentence = null;
      this.isBack = false;

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
            else {
              this.start();
            }
        }
      } else {
        this.shoot(control);
        this.moveShooter(control);
      }
    },
    async move() {
      await this.moveShooter();
      await this.moveLasers();
      await this.moveInvaders();
      await this.checkCollision();
      await this.checkEnd();
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
      return Promise.resolve();
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

      return Promise.resolve();
    },
    shoot(control) {
      const max = width * height - width - 2;
      const lastLaserIndex = this.lasers[this.lasers.length - 1];
      switch (control) {
        case "a":
        case "up":
          if (!lastLaserIndex || lastLaserIndex < max) {
            this.lasers.push(this.currentShooterIndex);
            shoot.play();
          }
      }
    },
    checkEnd() {
      const square = this.squares[this.currentShooterIndex];
      if (square.invader && square.shooter) {
        square.boom = true;
        this.resultSentence = "GAME OVER";
        gameOver.play();
        clearInterval(this.invadersId);
      }

      for (const i in this.alienInvaders) {
        if (this.alienInvaders[i] > this.squares.length) {
          this.resultSentence = "GAME OVER";
          gameOver.play();
          clearInterval(this.invadersId);
        }
      }
      if (this.total === this.results) {
        this.resultSentence = "YOU WIN";
        win.play();
        clearInterval(this.invadersId);
      }

      return Promise.resolve();
    },
    moveLasers() {
      for (const index in this.lasers) {
        const laserIndex = this.lasers[index];
        const square = this.squares[laserIndex];
        const nextLaserIndex = laserIndex - this.width;
        const nextSquare = this.squares[nextLaserIndex];

        if (square && nextSquare) {
          nextSquare.laser = true;
          square.laser = false;
          this.lasers[index] = nextLaserIndex;
        } else if (square) {
          this.lasers.splice(index, 1);
          square.laser = false;
        } else {
          this.lasers.splice(index, 1);
        }
      }

      return Promise.resolve();
    },
    checkCollision() {
      for (const index in this.lasers) {
        const square = this.squares[this.lasers[index]];
        if (square?.invader) {
          square.laser = false;
          square.invader = false;
          square.boom = true;
          invaderKilled.play();

          // Remove laser and alienInvader
          this.alienInvaders = this.alienInvaders.filter(
            (x) => this.lasers[index] !== x
          );
          this.lasers.splice(index, 1);
          this.results++;

          setTimeout(() => (square.boom = false), 300);
        }
      }
      return Promise.resolve();
    },
  },
};
</script>

<style lang="scss" scoped>
main {
  background-image: url(@/assets/img/night-sky.png);
  background-size: cover;
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
          content: "\25B6\FE0E";
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
      background-image: url(@/assets/img/alien.png);
    }

    &.shooter {
      background-image: url(@/assets/img/spaceship.png);
    }

    &.laser {
      background-image: url(@/assets/img/laser.png);
    }

    &.boom {
      background-image: url(@/assets/img/explosion.png);
    }
  }
}
</style>
