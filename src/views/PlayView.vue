<template lang="pug">
main
    p.score {{ `SCORE : ${results}/${alienInvaders.length}` }}
    h1.result(v-show="resultSentence") {{ resultSentence }}
    .grid
        div.square(v-for="squareClass of squares" :class="squareClass")
</template>

<script>
import { emitter } from "@/composables/useEvent";
const squareProps = {
  invader: false,
  shooter: false,
  laser: false,
  boom: false,
};
const width = 20;
const height = 20;

export default {
  data() {
    return {
      currentShooterIndex: width * height - Math.floor(width / 2),
      width: width,
      height: height,
      direction: 1,
      invadersId: false,
      goingRight: true,
      aliensRemoved: [],
      results: 0,
      lasers: [],
      alienInvaders: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
      ],
      squares: Array(width * height)
        .fill(null)
        .map(() => {
          return { ...squareProps };
        }),
      resultSentence: null,
    };
  },
  mounted() {
    this.squares[this.currentShooterIndex].shooter = true;

    for (const i in this.alienInvaders) {
      if (!this.aliensRemoved.includes(i)) {
        this.squares[this.alienInvaders[i]].invader = true;
      }
    }

    emitter.on("control", this.moveShooter);
    emitter.on("control", this.shoot);

    this.invadersId = setInterval(this.move, 600);
  },
  methods: {
    move() {
      this.moveShooter();
      this.moveInvaders();
      this.moveLasers();
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
        for (const i in this.alienInvaders) {
          this.alienInvaders[i] += this.width + 1;
          this.direction--;
          this.goingRight = false;
        }
      }

      if (leftEdge && !this.goingRight) {
        for (const i in this.alienInvaders) {
          this.alienInvaders[i] += this.width - 1;
          this.direction = 1;
          this.goingRight = true;
        }
      }

      for (const i in this.alienInvaders) {
        this.alienInvaders[i] += this.direction;
      }

      // Draw all invaders
      for (const i in this.alienInvaders) {
        if (!this.aliensRemoved.includes(i)) {
          this.squares[this.alienInvaders[i]].invader = true;
        }
      }

      this.checkEnd();
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
        this.resultSentence = "GAME OVER";
        clearInterval(this.invadersId);
      }

      for (const i in this.alienInvaders) {
        if (this.alienInvaders[i] > this.squares.length) {
          this.resultSentence = "GAME OVER";
          clearInterval(this.invadersId);
        }
      }
      if (this.aliensRemoved.length === this.alienInvaders.length) {
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
            const alienRemoved = this.alienInvaders.indexOf(nextLaserIndex);
            this.aliensRemoved.push(alienRemoved);
            debugger
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

  h1.result {
    font-family: "Squartiqa", serif;
    color: white;
    position: absolute;
    font-size: 3em;
    width: 100%;
    margin-left: -3%;
    top: 50%;
    text-align: center;
    transform: translateY(-50%);
  }

  .grid {
    width: 100%;
    height: 100%;
    border: solid purple 4px;
    display: flex;
    flex-wrap: wrap;
  }

  .grid .square {
    width: 5%;
    height: 5%;

    &.invader {
      background-color: purple;
      border-radius: 10px;
    }

    &.shooter {
      background-color: green;
    }

    &.laser {
      background-color: orange;
    }

    &.boom {
      background-color: red;
    }
  }
}
</style>
