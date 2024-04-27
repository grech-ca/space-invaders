import { PLAYER_SIZE, STAR_MAX_SIZE } from "../constants"
import { Position } from "../types/Position"
import { Asteroid } from "./Asteroid"
import { Enemy } from "./Enemy"
import { Level } from "./Level"
import { Player } from "./Player"
import { Star } from "./Star"

export class Game {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  level: Level

  constructor() {
    this.canvas = document.createElement('canvas')
    this.canvas.height = window.innerHeight
    this.canvas.width = window.innerWidth
    this.ctx = this.canvas.getContext('2d')!
    this.level = new Level([
      new Player({
        position: {
          x: (window.innerWidth - PLAYER_SIZE) / 2,
          y: (window.innerHeight - PLAYER_SIZE) / 2,
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
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

    this.level.entities.forEach((_, id) => {
      const entity = this.level.entities.get(id)
      if (!entity) return

      entity.tick?.()
      entity.draw(this.ctx)
    })
  }

  start() {
    const step: FrameRequestCallback = () => {
      this.repaint()
      requestAnimationFrame(step)
    }

    for (let i = 0; i < 100; i++) {
      this.spawnStar({
        x: Math.round(Math.random() * (window.innerWidth - STAR_MAX_SIZE)),
        y: Math.round(Math.random() * (window.innerHeight - STAR_MAX_SIZE)),
      })
    }

    setInterval(() => {
      if (Math.round(Math.random() * 100) > 45) {
        this.spawnEnemy(Math.round(window.innerWidth / 50 * (Math.random() * 50)))
      } else {
        this.spawnAsteroid(Math.round(window.innerWidth / 50 * (Math.random() * 50)))
      }
    }, 400)

    setInterval(() => {
      this.spawnStar()
    }, 200)

    requestAnimationFrame(step)
  }
}
