import Game from "../engine"
import { EntityType } from "./drawEntities"

interface Pos {
  x: number
  y: number
}

function addProjectile (
  item: string,
  player: EntityType,
  direction: Pos,
  pushProjectile: (projectile: EntityType) => void,
): void {
  console.log("addProjectile", item, player.weapon, direction)
  let projectile: EntityType = {
    name: item,
    image: `/assets/${player.weapon || item}.png`,
    width: 32,
    height: 32,
    pos: {
      x: player.pos.x,
      y: player.pos.y,
    },
    vel: {
      x: direction.x,
      y: direction.y,
    },
    direction: "x",
    id: `${item}-${Math.random()}`,
    tick: 50,
    health: 1,
    speed: 10,
  }
  Game.createEntity(projectile)
  pushProjectile(projectile)
}

export { addProjectile }
