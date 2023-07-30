import { RefObject } from 'react';
import { Config, config } from '../config/config';
import Game from '../engine';
import { Keys } from '../engine/input/keyboard';
import { EntityType } from './drawEntities';

interface Entities {
  players: Array<EntityType>;
  // Define the structure of your entities object
}

interface Position {
  x: number;
  y: number;
}

const setupGame = (
  config: Config,
  keys: Keys,
  canvas: RefObject<HTMLCanvasElement>,
  entities: Entities,
  positions: Position
) => {
  // setup keyboard
  Game.keyboard(keys);
  // Game.mouse(canvas, config.tileSize);
  // add player entities
  entities.players.forEach((player)=>{
    const tilePos = player.pos;

    player.pos.x = tilePos.x * config.tileSize;
    player.pos.y = tilePos.y * config.tileSize;
    Game.createEntity(player);
  })
}
export { setupGame }
