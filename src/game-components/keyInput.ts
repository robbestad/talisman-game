import { Config } from "../config/config"
import { EntityType } from "./drawEntities"
import keypress from "./keypress/index"

const keyInput = (
  Config: Config,
  keys: Record<string, boolean>,
  player: EntityType,
  modifier: number = 1,
  addProjectile: Function,
  pushProjectile: Function,
) => {
  const { pos, speed } = player
  type Pos = { x: number; y: number }
  const Shoot = (direction: Pos) => {
    window.talisman.cooldown--;
    if (window.talisman.cooldown > 1) return
    
    addProjectile(player?.weapon||"fire", player, direction, pushProjectile);
    if(window.talisman.entities.players[0].weapon==="lightning"){
      window.talisman.cooldown=10;
    }
    else  if(window.talisman.entities.players[0].weapon==="bolt"){
      window.talisman.cooldown=20;
    } else {
      window.talisman.cooldown=35;
    }
  }
  if (keypress.up(keys)) {
    Shoot({ x: 0, y: -500 });
  }

  if (keypress.down(keys)) {
    Shoot({ x: 0, y: 500 })
  }

  if (keypress.left(keys)) {
    Shoot({ x: -500, y: 0 })
  }

  if (keypress.right(keys)) {
    Shoot({ x: 500, y: 0 })
  }

  if (keypress.w(keys)) {
    if (pos.y > 0) pos.y -= speed * modifier
  }

  if (keypress.s(keys)) {
    if (pos.y < Config.height - 32) pos.y += speed * modifier
  }

  if (keypress.a(keys)) {
    if (pos.x > 8) pos.x -= speed * modifier
  }

  if (keypress.d(keys)) {
    if (pos.x < Config.width - 32) pos.x += speed * modifier
  }
}

export { keyInput }
