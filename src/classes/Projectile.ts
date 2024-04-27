import { Entity } from "./Entity";
import {Position} from '../types/Position'
import { PROJECTILE_STEP_SIZE } from "../constants";
import { Enemy } from "./Enemy";
import { Asteroid } from "./Asteroid";

export class Projectile extends Entity {
  constructor(data: {position: Position}) {
    super({
      position: data.position,
      size: {
        height: 15,
        width: 4,
      },
      color: '#fa0',
    })
  }
  
  tick() {
    if (this.position.y + this.size.height < 0) {
      this.level?.remove(this.id)
      return
    }

    this.position.y -= PROJECTILE_STEP_SIZE

    this.level?.entities.forEach((entity) => {
      if (entity instanceof Enemy) {
        if (this.checkCollision(entity)) {
          entity.kill()
          this.remove()
        }
      }

      if (entity instanceof Asteroid) {
        if (this.checkCollision(entity)) {
          this.remove()
        }
      }
    })
  }
}
