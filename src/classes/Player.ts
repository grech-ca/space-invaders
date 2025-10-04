import { PLAYER_SIZE, PLAYER_STEP_SIZE, SHOOTING_DELAY } from "../constants";
import { KeyboardKey } from "../enums/KeyboardKey";
import { game } from "../main";
import { Position } from "../types/Position";
import { Entity } from "./Entity";
import { ExplosionEffect } from "./ExplosionEffect";
import { Level } from "./Level";
import { Projectile } from "./Projectile";
import { SFX } from "./SFX";

export class Player extends Entity {
  private activeKeys: Map<KeyboardKey, boolean> = new Map()
  private canShoot = true
  private isInvincible = false
  private health = 3

  private activateKey = (key: KeyboardKey) => {
    this.activeKeys.set(key, true)
  }
  private deactivateKey = (key: KeyboardKey) => this.activeKeys.set(key, false)

  constructor(data: {position: Position, level?: Level}) {
    super({
      color: '#fff',
      size: {
        height: PLAYER_SIZE * devicePixelRatio,
        width: PLAYER_SIZE * devicePixelRatio,
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

  kill() {
    this.level?.spawn(new ExplosionEffect({
      scale: 10 * devicePixelRatio,
      position: {
        x: this.position.x + this.size.width / 2 - 50 / 2,
        y: this.position.y + this.size.height / 2 - 50 / 2,
      },
      speed: 5
    }))
    this.remove()
  }

  damage(value: number) {
    if (this.isInvincible) return

    this.health -= value

    if (this.health <= 0) {
      this.kill()
    } else {
      SFX.play('hit')
      this.isInvincible = true
      setTimeout(() => this.isInvincible = false, 500)
    }
  }

  private tiltLeft() {
    this.angle = -15
  }

  private tiltRight() {
    this.angle = 15
  }

  private resetAngle() {
    this.angle = 0
  }

  draw(ctx: CanvasRenderingContext2D) {
    super.draw(ctx)

    // Health bar
    ctx.save()
    ctx.fillStyle = '#f33'
    ctx.fillRect(15 * devicePixelRatio, 15 * devicePixelRatio, 50 * this.health * devicePixelRatio, 15 * devicePixelRatio)
    ctx.restore()
  }

  tick() {
    this.activeKeys.forEach((value, key) => {
      if (!value) return

      switch (key) {
        case KeyboardKey.ArrowUp:
          this.position.y = Math.max(0, this.position.y - PLAYER_STEP_SIZE * devicePixelRatio)
          break
        case KeyboardKey.ArrowDown:
          this.position.y = Math.min(game.canvas.height - this.size.height, this.position.y + PLAYER_STEP_SIZE * devicePixelRatio)
          break
        case KeyboardKey.ArrowLeft:
          this.tiltLeft()
          this.position.x = Math.max(0, this.position.x - PLAYER_STEP_SIZE * devicePixelRatio)
          break
        case KeyboardKey.ArrowRight:
          this.tiltRight()
          this.position.x = Math.min(game.canvas.width - this.size.width, this.position.x + PLAYER_STEP_SIZE * devicePixelRatio)
          break
        case KeyboardKey.Space:
          this.shoot()
          break
      }
    })

    if (!(this.activeKeys.get(KeyboardKey.ArrowLeft) || this.activeKeys.get(KeyboardKey.ArrowRight))) {
      this.resetAngle()
    }
  }
}
