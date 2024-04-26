import { PLAYER_SIZE, PLAYER_STEP_SIZE, SHOOTING_DELAY } from "../constants";
import { KeyboardKey } from "../enums/KeyboardKey";
import { Position } from "../types/Position";
import { Entity } from "./Entity";
import { Level } from "./Level";
import { Projectile } from "./Projectile";

export class Player extends Entity {
  activeKeys: Map<KeyboardKey, boolean> = new Map()
  canShoot = true

  private activateKey = (key: KeyboardKey) => {
    this.activeKeys.set(key, true)
  }
  private deactivateKey = (key: KeyboardKey) => this.activeKeys.set(key, false)

  constructor(data: {position: Position, level?: Level}) {
    super({
      color: '#fff',
      size: {
        height: PLAYER_SIZE,
        width: PLAYER_SIZE,
      },
      position: data.position,
      level: data.level,
    })

    document.addEventListener('keydown', ({key}) => this.activateKey(key as KeyboardKey))
    document.addEventListener('keyup', ({key}) => this.deactivateKey(key as KeyboardKey))
  }

  private shoot() {
    if (!this.canShoot) return

    this.canShoot = false
    setTimeout(() => this.canShoot = true, SHOOTING_DELAY)

    this.level?.spawn(new Projectile({
      position: {
        x: this.position.x + this.size.width / 2,
        y: this.position.y,
      }
    }))
  }

  tick() {
    this.activeKeys.forEach((value, key) => {
      if (!value) return

      switch (key) {
        case KeyboardKey.ArrowUp:
          this.position.y = Math.max(0, this.position.y - PLAYER_STEP_SIZE)
          break
        case KeyboardKey.ArrowDown:
          this.position.y = Math.min(window.innerHeight - PLAYER_SIZE, this.position.y + PLAYER_STEP_SIZE)
          break
        case KeyboardKey.ArrowLeft:
          this.position.x = Math.max(0, this.position.x - PLAYER_STEP_SIZE)
          break
        case KeyboardKey.ArrowRight:
          this.position.x = Math.min(window.innerWidth - PLAYER_SIZE, this.position.x + PLAYER_STEP_SIZE)
          break
        case KeyboardKey.Space:
          this.shoot()
          break
      }
    })
  }
}
