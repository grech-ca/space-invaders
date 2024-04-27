import { createId } from "@paralleldrive/cuid2"
import { Size } from "../types/Size"
import { Position } from "../types/Position"
import { Level } from "./Level"

export class Entity {
  id: string
  position: Position
  size: Size
  color: string
  level?: Level

  constructor(data: Pick<Entity, 'size' | 'position' | 'color' | 'level'>) {
    this.id = createId()
    this.size = data.size
    this.position = data.position
    this.color = data.color
    this.level = data.level
  }

  tick() {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
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
