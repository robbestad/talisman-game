import { sign } from '../math/sign';

interface Position {
  x: number;
  y: number;
}

interface Entity {
  pos: Position;
}

const targetEntity = (
  entityA: Entity,
  entityB: Entity,
  speed: number
): void => {
  const posA = entityA.pos;
  const posB = entityB.pos;
  const velX = sign(posB.x - posA.x) * speed;
  const velY = sign(posB.y - posA.y) * speed;
  entityA.pos.x += velX;
  entityA.pos.y += velY;
};

export { targetEntity };
