import { game } from "../main";
import { Position } from "../types/Position";
import { Entity } from "./Entity";
import { Player } from "./Player";

const MAX_SIZE = 75

export class Asteroid extends Entity {
  rotationDirection = Math.round(Math.random()) ? 1 : -1

  constructor(data: {position: Position}) {
    const size = Math.round(Math.random() * 5) * 15 * devicePixelRatio

    super({
      color: '#444',
      size: {
        height: size,
        width: size,
      },
      position: data.position
    })
  }

  tick() {
    this.position.y += (50 - Math.round(MAX_SIZE * 0.7) * this.size.height / MAX_SIZE) * devicePixelRatio
    this.angle += (10 - 9 * this.size.height / MAX_SIZE) * this.rotationDirection

    this.level?.entities.forEach(player => {
      if (!(player instanceof Player)) return

      if (this.checkCollision(player)) {
        player.damage(2)
      }
    })

    if (this.position.y > game?.canvas.height) {
      this.remove()
    }
  }
}
