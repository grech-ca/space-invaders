import { createId } from "@paralleldrive/cuid2"
import { Size } from "../types/Size"
import { Position } from "../types/Position"
import { Level } from "./Level"

export class Entity {
  id: string
  position: Position
  size: Size
  color: string
  angle: number
  level?: Level

  constructor(data: {size: Size; position: Position; level?: Level; angle?: number; color: string}) {
    this.id = createId()
    this.size = data.size
    this.position = data.position
    this.color = data.color
    this.level = data.level
    this.angle = data.angle ?? 0
  }

  tick() {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.position.x + this.size.width / 2, this.position.y + this.size.height / 2)
    ctx.rotate(Math.PI / 180 * this.angle)
    ctx.fillStyle = this.color
    ctx.fillRect(-this.size.width / 2, -this.size.height / 2, this.size.width, this.size.height)
    ctx.restore()
  }

  remove() {
    this.level?.remove(this.id)
  }

  private checkPointCollision(point: Position, entity: Entity) {
    return point.x >= entity.position.x
      && point.x <= entity.position.x + entity.size.width
      && point.y >= entity.position.y
      && point.y <= entity.position.y + entity.size.height
  }

  monoCheckCollision(entity: Entity) {
    const isTopLeftColliding = this.checkPointCollision({
      x: this.position.x,
      y: this.position.y,
    }, entity)
    const isTopRightColliding = this.checkPointCollision({
      x: this.position.x + this.size.width,
      y: this.position.y
    }, entity)
    const isBottomLeftColliding = this.checkPointCollision({
      x: this.position.x,
      y: this.position.y + this.size.height
    }, entity)
    const isBottomRightColliding = this.checkPointCollision({
      x: this.position.x + this.size.width,
      y: this.position.y + this.size.height
    }, entity)

    return isTopLeftColliding || isTopRightColliding || isBottomLeftColliding || isBottomRightColliding
  }

  checkCollision(entity: Entity) {
    return this.monoCheckCollision(entity) || entity.monoCheckCollision(this)
  }
}
