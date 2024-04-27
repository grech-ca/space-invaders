import { SCREEN_HEIGHT, SCREEN_WIDTH, STAR_MAX_SIZE } from "../constants";
import { random } from "../helpers/random";
import { Position } from "../types/Position";
import { Entity } from "./Entity";

export class Star extends Entity {
  constructor({
    size = Math.round(Math.random() * STAR_MAX_SIZE),
    position = {
      x: Math.round(Math.random() * (SCREEN_WIDTH - size)),
      y: -15,
    }
  }: {size?: number; position?: Position}) {
    super({
      size: {
        width: size,
        height: size,
      },
      position,
      color: `hsla(${random([119, 360, 193, 53])}, 100%, ${Math.round(Math.random() * 10) > 5 ? '100%' : '70%'}, ${size / STAR_MAX_SIZE * 80}%)`,
      angle: Math.round(Math.random() * 360),
    })
  }

  tick() {
    this.position.y += 1 * (this.size.height / STAR_MAX_SIZE)

    if (this.position.y - this.size.height > SCREEN_HEIGHT) {
      this.remove()
    }
  }
}
