import Game from '../engine';
import { EntityType } from './drawEntities';

interface Pos {
  x: number;
  y: number;
}

interface Entity {
  name: string;
  image: string;
  width: number;
  height: number;
  health: number;
  pos: Pos;
  vel: Pos;
  tick: number;
  direction: string;
  speed: number;
}

let directions = [1, -1];

const addEntity = (
  item: string,
  pos: Pos,
  health: number = 60,
  speed: number = 1,
  callback: (entity: EntityType) => void
): void => {
  let entity: EntityType = {
    name: item,
    id: `${item}-${Math.random()}`,
    image: `${item}.png`,
    width: 32,
    height: 32,
    health: health,
    pos: pos,
    vel:{
      x: Game.shuffle(directions)[0] as number,
      y: Game.shuffle(directions)[0] as number
    },
    tick: 50,
    direction: Game.shuffle(["x","y"])[0] as string,
    speed: speed+(Math.random()*1)
  };
  Game.createEntity(entity);
  callback(entity);
}

export {addEntity}
