import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants";
import { random } from "../helpers/random";
import { randomInRange } from "../helpers/random-in-range";
import { Position } from "../types/Position";
import { Entity } from "./Entity";
import { Star } from "./Star";

const MIN_STARS_COUNT = 5
const MAX_STARS_COUNT = 10
// TODO: MAX_BRANCHES_PER_STAR = 5

type ConstellationNode = {
  star: Star
  nodes: ConstellationNode[]
}

export class Constellation extends Entity {
  starsCount: number
  jointColor: string
  tree: ConstellationNode

  private createNode = (starsLeft: number, parentStar?: Star): ConstellationNode => {
    let newStarsLeft = Math.max(0, starsLeft - 1)
    const branchesCount = newStarsLeft ? Math.round(Math.random() * (newStarsLeft - 1)) + 1 : 0
    newStarsLeft -= branchesCount
    const nodes = []
    let starsPerBranches = Array(branchesCount).fill(1)

    for (let i = 0; i < branchesCount; i++) {
      if (newStarsLeft <= 0) break

      if (i + 1 === branchesCount) {
        starsPerBranches[i] += newStarsLeft
        break
      }

      const starsCount = randomInRange(0, newStarsLeft)
      newStarsLeft -= starsCount
      starsPerBranches[i] += starsCount
    }

    const angle = Math.random() * Math.PI * 2
    const range = 20

    const star = new Star({
      position: parentStar ? {
        x: parentStar.position.x + Math.cos(angle) * range * parentStar.size.height,
        y: parentStar.position.y + Math.sin(angle) * range * parentStar.size.height,
      } : this.position,
      size: parentStar?.size?.height ?? randomInRange(1, 2),
    })

    for (const starsPerBranch of starsPerBranches) {
      nodes.push(this.createNode(starsPerBranch, star))
    }

    return {
      star,
      nodes,
    }
  }

  constructor({
    starsCount = randomInRange(MIN_STARS_COUNT, MAX_STARS_COUNT),
    jointColor = random(['#fff']),
    position = {
      x: randomInRange(0, SCREEN_WIDTH),
      y: -SCREEN_HEIGHT/4,
    },
  }: {
    starsCount?: number
    jointColor?: string
    position?: Position
  }) {
    super({
      size: {
        height: 0,
        width: 0,
      },
      color: '#000',
      position: {
        x: 0,
        y: 0,
      }
    })

    this.starsCount = starsCount
    this.jointColor = jointColor
    this.position = position
    this.tree = this.createNode(this.starsCount)
  }

  private drawNode(node: ConstellationNode, ctx: CanvasRenderingContext2D) {
    node.star.draw(ctx)
    node.nodes.forEach(subNode => this.drawNode(subNode, ctx))
  }

  private drawJoint(node: ConstellationNode, ctx: CanvasRenderingContext2D, parentNode?: ConstellationNode) {
    if (parentNode) {
      ctx.save()
      ctx.lineWidth = 0.1
      ctx.strokeStyle = this.jointColor
      ctx.beginPath()
      ctx.moveTo(node.star.position.x, node.star.position.y)
      ctx.lineTo(parentNode.star.position.x, parentNode.star.position.y)
      ctx.stroke()
      ctx.restore()
    }
    node.nodes.forEach(subNode => this.drawJoint(subNode, ctx, node))
  }

  private tickNode(node: ConstellationNode) {
    node.star.tick()
    node.nodes.forEach(subNode => this.tickNode(subNode))
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.drawJoint(this.tree, ctx)
    this.drawNode(this.tree, ctx)
  }

  tick() {
    this.tickNode(this.tree)
  }
}
