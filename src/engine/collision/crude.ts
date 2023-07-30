import { EntityType } from "../../game-components/drawEntities";

const crudeCollision = (
  entityA: Partial<EntityType> = { pos: { x: 0, y: 0 } },
  entityB: Partial<EntityType> = { pos: { x: 0, y: 0 } },
  size: number = 32
): boolean => {
  if(!entityA.pos || !entityB.pos) return false
  return (
    entityA.pos.x <= entityB.pos.x + size &&
    entityB.pos.x <= entityA.pos.x + size &&
    entityA.pos.y <= entityB.pos.y + size &&
    entityB.pos.y <= entityA.pos.y + size
  );
};

export { crudeCollision };
