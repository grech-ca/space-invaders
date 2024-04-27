import { Position } from "../types/Position";
import { Effect } from "./Effect";
import { SFX } from "./SFX";

export class ExplosionEffect extends Effect {
  constructor({position, scale = 10}: {position: Position; scale?: number}) {
    super({
      frames: [
        [
          [null, null, null, null, null],
          [null, '#fa0', '#fa0', '#fa0', null],
          [null, '#fa0', '#fa0', '#fa0', null],
          [null, '#fa0', '#fa0', '#fa0', null],
          [null, null, null, null, null],
        ],
        [
          [null, '#fa0', '#fa0', '#fa0', null],
          ['#fa0', '#fa0', '#fa0', '#fa0', '#fa0'],
          ['#fa0', '#fa0', '#fa0', '#fa0', '#fa0'],
          ['#fa0', '#fa0', '#fa0', '#fa0', '#fa0'],
          [null, '#fa0', '#fa0', '#fa0', null],
        ],
        [
          ['#fa0', '#fa0', '#fa0', '#fa0', '#fa0'],
          ['#fa0', '#fa0', '#fa0', '#fa0', '#fa0'],
          ['#fa0', '#fa0', '#fa0', '#fa0', '#fa0'],
          ['#fa0', '#fa0', '#fa0', '#fa0', '#fa0'],
          ['#fa0', '#fa0', '#fa0', '#fa0', '#fa0'],
        ],
        [
          ['#fa0', '#fa0', '#fa0', '#fa0', '#fa0'],
          ['#fa0', '#fa0', null, '#fa0', '#fa0'],
          ['#fa0', null, null, null, '#fa0'],
          ['#fa0', '#fa0', null, '#fa0', '#fa0'],
          ['#fa0', '#fa0', '#fa0', '#fa0', '#fa0'],
        ],
        [
          ['#fa0', '#fa0', '#fa0', '#fa0', '#fa0'],
          ['#fa0', null, null, null, '#fa0'],
          ['#fa0', null, null, null, '#fa0'],
          ['#fa0', null, null, null, '#fa0'],
          ['#fa0', '#fa0', '#fa0', '#fa0', '#fa0'],
        ],
        [
          ['#fa0', '#fa0', '#fa0', '#fa0', '#fa0'],
          ['#fa0', null, null, null, '#fa0'],
          ['#fa0', null, null, null, '#fa0'],
          ['#fa0', null, null, null, '#fa0'],
          ['#fa0', '#fa0', '#fa0', '#fa0', '#fa0'],
        ].map(row => row.map(color => Math.round(Math.random()) ? color : null)),
      ],
      ticksPerFrame: 3,
      isFinite: true,
      position,
      scale,
    })

    SFX.play('explosion')
  }
}
