import { Position } from "../types/Position";
import { Entity } from "./Entity";

type Frame = (string | null)[][]

export class Effect extends Entity {
  frames: Frame[]
  scale: number
  ticksPerFrame: number
  ticksElapsed: number = 0
  isFinite: boolean
  speed: number = 0

  constructor(data: {
    frames: Frame[]
    scale: number
    ticksPerFrame: number
    position: Position
    isFinite: boolean
    speed?: number
  }) {
    super({
      position: data.position,
      size: {
        width: data.frames[0].length,
        height: data.frames.length
      },
      color: '#0000',
    })

    this.frames = data.frames
    this.scale = data.scale
    this.ticksPerFrame = data.ticksPerFrame
    this.isFinite = data.isFinite
    if (data.speed) this.speed = data.speed
  }

  tick() {
    this.position.y += this.speed * devicePixelRatio
    this.ticksElapsed++
  }

  draw(ctx: CanvasRenderingContext2D) {
    const frameIndex = Math.ceil((this.isFinite ? this.ticksElapsed : this.ticksElapsed % this.frames.length) / this.ticksPerFrame) - 1

    if (frameIndex > this.frames.length) {
      if (this.isFinite) {
        this.level?.remove(this.id)
        return
      }
    }

    const frame = this.frames[frameIndex]

    frame?.forEach((row, y) => {
      row.forEach((col, x) => {
        if (!col) return
        ctx.fillStyle = col
        ctx.fillRect(this.position.x + x * this.scale, this.position.y + y * this.scale, this.scale, this.scale)
      })
    })
  }
}
