import { Entity } from "./Entity";
import {Position} from '../types/Position'
import { Player } from "./Player";
import { ExplosionEffect } from "./ExplosionEffect";
import { game } from "../main";

export class Enemy extends Entity {
  speed: number

  constructor(data: {position: Position}) {
    super({
      size: {
        width: 35 * devicePixelRatio,
        height: 35 * devicePixelRatio,
      },
      position: data.position,
      color: '#75f',
    })

    this.speed = 5 + Math.round(Math.random() * 5)
  }

  tick() {
    this.position.y += this.speed * devicePixelRatio

    this.level?.entities.forEach(player => {
      if (!(player instanceof Player)) return

      if (this.checkCollision(player)) {
        this.kill()
        player.damage(1)
      }
    })

    if (this.position.y > game.canvas.height) {
      this.remove()
    }
  }

  kill() {
    this.level?.spawn(new ExplosionEffect({
      scale: 10 * devicePixelRatio,
      position: {
        x: this.position.x + this.size.width / 2 - 50 / 2,
        y: this.position.y + this.size.height / 2 - 50 / 2,
      },
      speed: this.speed
    }))
    this.remove()
  }
}
