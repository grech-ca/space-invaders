import { Entity } from "./Entity";
import {Position} from '../types/Position'
import { Player } from "./Player";

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
        this.level?.remove(player.id)
      }
    })

    if (this.position.y > window.innerHeight) {
      this.level?.remove(this.id)
    }
  }
}
