import { Entity } from "./Entity";
import {Position} from '../types/Position'
import { Player } from "./Player";
import { ExplosionEffect } from "./ExplosionEffect";

export class Enemy extends Entity {
  speed: number

  constructor(data: {position: Position}) {
    super({
      size: {
        width: 35,
        height: 35,
      },
      position: data.position,
      color: '#75f',
    })

    this.speed = 5 + Math.round(Math.random() * 5)
  }

  tick() {
    this.position.y += this.speed

    this.level?.entities.forEach(player => {
      if (!(player instanceof Player)) return

      if (this.checkCollision(player)) {
        player.kill()
      }
    })

    if (this.position.y > window.innerHeight) {
      this.remove()
    }
  }

  kill() {
    this.level?.spawn(new ExplosionEffect({
      scale: 10,
      position: {
        x: this.position.x + this.size.width / 2 - 50 / 2,
        y: this.position.y + this.size.height / 2 - 50 / 2,
      }
    }))
    this.remove()
  }
}
