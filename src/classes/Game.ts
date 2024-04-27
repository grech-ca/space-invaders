import { PLAYER_SIZE, SCREEN_HEIGHT, SCREEN_WIDTH, STAR_MAX_SIZE } from "../constants"
import { Position } from "../types/Position"
import { Asteroid } from "./Asteroid"
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

  constructor() {
    this.canvas = document.createElement('canvas')
    this.canvas.height = SCREEN_HEIGHT
    this.canvas.width = SCREEN_WIDTH
    this.ctx = this.canvas.getContext('2d')!
    this.level = new Level([
      new Player({
        position: {
          x: (SCREEN_WIDTH - PLAYER_SIZE) / 2,
          y: (SCREEN_HEIGHT - PLAYER_SIZE) / 2,
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

    const step: FrameRequestCallback = () => {
      this.repaint()
      this.time++

      if (!(this.time % 24)) {
        if (Math.round(Math.random() * 100) > 45) {
          this.spawnEnemy(Math.round(SCREEN_WIDTH / 50 * (Math.random() * 50)))
        } else {
          this.spawnAsteroid(Math.round(SCREEN_WIDTH / 50 * (Math.random() * 50)))
        }
      }

      if (!(this.time % 10)) {
        this.spawnStar()
      }

      requestAnimationFrame(step)
    }

    for (let i = 0; i < 100; i++) {
      this.spawnStar({
        x: Math.round(Math.random() * (SCREEN_WIDTH - STAR_MAX_SIZE)),
        y: Math.round(Math.random() * (SCREEN_HEIGHT - STAR_MAX_SIZE)),
      })
    }

    requestAnimationFrame(step)
  }
}
