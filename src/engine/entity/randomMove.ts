import { EntityType } from '../../game-components/drawEntities';
import { shuffle } from '../math/shuffle';

interface Position {
  x: number;
  y: number;
}

interface Config {
  height: number;
  width: number;
  tileSize: number;
}

const randomMove = (
  entity: EntityType,
  speed: number = 1,
  deltaTime: number = 0.01,
  config: Config = {
    height: 512,
    width: 512,
    tileSize: 32
  }
): void => {
  let { pos, vel } = entity;
  let direction: string[] = ["x","y"];
  deltaTime = 1;
  entity.tick -= 1;

  if (entity.tick <= 0) {
    entity.direction = shuffle(direction)[0] as string;
    entity.tick = Math.random() * 50;
  }

  if (pos.x + vel.x > config.width - config.tileSize * 2) {
    vel.x = -speed * deltaTime;
  }
  if (pos.x + vel.x < config.tileSize / 2) {
    vel.x = speed * deltaTime;
  }

  if (pos.y + vel.y > config.height - config.tileSize * 2) {
    vel.y = -speed * deltaTime;
  }
  if (pos.y + vel.y < config.tileSize / 2) {
    vel.y = speed * deltaTime;
  }

  entity.pos.x += entity.direction === "x" ? vel.x * deltaTime: 0;
  entity.pos.y += entity.direction === "y" ? vel.y * deltaTime: 0;
};

export { randomMove };
