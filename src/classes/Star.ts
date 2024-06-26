import { STAR_MAX_SIZE } from "../constants";
import { random } from "../helpers/random";
import { game } from "../main";
import { Position } from "../types/Position";
import { Entity } from "./Entity";

export class Star extends Entity {
  constructor({
    size = Math.round(Math.random() * STAR_MAX_SIZE) * devicePixelRatio,
    position = {
      x: Math.round(Math.random() * (game.canvas.width - size)),
      y: -15,
    },
    color = `hsla(${random([119, 360, 193, 53])}, 100%, ${Math.round(Math.random() * 10) > 5 ? '100%' : '70%'}, ${size / STAR_MAX_SIZE * 80}%)`,
  }: {size?: number; position?: Position; color?: string}) {
    super({
      size: {
        width: size,
        height: size,
      },
      position,
      color,
      angle: Math.round(Math.random() * 360),
    })
  }

  tick() {
    this.position.y += 1 * (this.size.height / STAR_MAX_SIZE) * devicePixelRatio

    if (this.position.y - this.size.height > (game.canvas.height ?? 0)) {
      this.remove()
    }
  }
}
