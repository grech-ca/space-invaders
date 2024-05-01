import { MS_PER_FRAME, PLAYER_SIZE, SCREEN_HEIGHT, SCREEN_WIDTH, STAR_MAX_SIZE } from "../constants"
import { randomInRange } from "../helpers/random-in-range"
import { Position } from "../types/Position"
import { Asteroid } from "./Asteroid"
import { Constellation } from "./Constellation"
import { Enemy } from "./Enemy"
import { Level } from "./Level"
import { Player } from "./Player"
import { SFX } from "./SFX"
import { Star } from "./Star"

export class Game {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  level: Level
  time: number = 0
  isPaused = false
  ratio = window.devicePixelRatio

  constructor() {
    this.canvas = document.createElement('canvas')
    this.canvas.height = Math.floor(SCREEN_HEIGHT * window.devicePixelRatio)
    this.canvas.width = Math.floor(SCREEN_WIDTH * window.devicePixelRatio)
    this.canvas.style.height = `${SCREEN_HEIGHT}px`
    this.canvas.style.width = `${SCREEN_WIDTH}px`
    this.ctx = this.canvas.getContext('2d')!
    this.level = new Level([
      new Player({
        position: {
          x: (this.canvas.width - PLAYER_SIZE) / 2,
          y: (this.canvas.height - PLAYER_SIZE) / 2,
        }
      }),
    ])

    document.getElementById('app')?.appendChild(this.canvas)
  }

  private spawnEnemy(x: number) {
    this.level.spawn(new Enemy({
      position: {
        x,
        y: -50,
      }
    }))
  }

  private spawnAsteroid(x: number) {
    this.level.spawn(new Asteroid({
      position: {
        x,
        y: -50,
      }
    }))
  }

  private spawnStar(position?: Position) {
    this.level.spawn(new Star({position}))
  }

  private spawnConstellation(position?: Position) {
    this.level.spawn(new Constellation({position}))
  }

  private repaint() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.level.entities.forEach((_, id) => {
      const entity = this.level.entities.get(id)
      if (!entity) return

      entity.tick?.()
      entity.draw(this.ctx)
    })
  }

  start() {
    SFX.init()

    document.addEventListener('keyup', ({key}) => {
      if (key === 'Escape') {
        console.log(this.isPaused)
        this.isPaused = !this.isPaused
      }
    })

    const step: FrameRequestCallback = () => {
      if (!this.isPaused) {
        this.repaint()
        this.time++

        if (!(this.time % 24)) {
          if (Math.round(Math.random() * 100) > 45) {
            this.spawnEnemy(Math.round(this.canvas.width / 50 * (Math.random() * 50)))
          } else {
            this.spawnAsteroid(Math.round(this.canvas.width / 50 * (Math.random() * 50)))
          }
        }

        if (!(this.time % 10)) {
          this.spawnStar()
        }

        if (!(this.time % 1000)) {
          this.spawnConstellation()
        }
      }

      setTimeout(step, MS_PER_FRAME)
    }

    for (let i = 0; i < 50; i++) {
      this.spawnStar({
        x: Math.round(Math.random() * (this.canvas.width - STAR_MAX_SIZE)),
        y: Math.round(Math.random() * (this.canvas.height - STAR_MAX_SIZE)),
      })
    }

    for (let i = 0; i < 5; i++) {
      this.spawnConstellation({
        x: randomInRange(0, this.canvas.width),
        y: randomInRange(0, this.canvas.height),
      })
    }

    setTimeout(step, MS_PER_FRAME)
  }
}
