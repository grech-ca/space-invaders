import { Entity } from "./Entity";

export class Level {
  entities: Map<string, Entity>

  constructor(entities: Entity[]) {
    this.entities = new Map(entities.map(entity => {
      entity.level = this
      return [entity.id, entity]
    }))
  }

  spawn(entity: Entity) {
    entity.level = this
    this.entities.set(entity.id, entity)
  }

  remove(id: Entity['id']) {
    this.entities.delete(id)
  }
}
