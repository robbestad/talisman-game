import { RefObject } from "react"
import Game from "../engine"
import { Entities } from "../config/config"

interface ConfigType {
  backgrounds: {
    game: string
  }
  // add other properties of Config as needed
}

export interface EntityType {
  image: string
  id: string
  name: string
  width: number
  weapon?: string
  height: number
  _creating?: boolean
  _sprite?: HTMLImageElement
  pos: {
    x: number
    y: number
  }
  direction: string,
  vel:  {
    x: number
    y: number
  };
  tick: number,
  health: number,
  speed : number,
  // add other properties of an Entity as needed
}

interface EntitiesType {
  projectiles: EntityType[]
  monsters: EntityType[]
  players: EntityType[]
}

const drawEntities = (Config: ConfigType, canvas: RefObject<HTMLCanvasElement>, entities: Entities) => {
  if (!canvas.current) return
  // Draw all entities
  Game.loadImage(canvas, Config.backgrounds.game)

  entities.projectiles.forEach((item) => {
    Game.drawEntity(canvas, item)
  })

  entities.monsters.forEach((monster) => {
    Game.drawEntity(canvas, monster)
  })

  entities.players.forEach((player) => {
    Game.drawEntity(canvas, player)
  })
}

export { drawEntities }
