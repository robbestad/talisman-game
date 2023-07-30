import { EntityType } from "../../game-components/drawEntities";

const createEntity = (
  entity: EntityType
): void => {
  // provide entity with an ID
  entity.id = (Math.random() * 2).toString();
  // flag it so we don't try to create
  // the entity twice
  entity._creating = true;
  let entityImage = new Image();
  entityImage.src = entity.image;
  entityImage.onload = () => {
    entity._sprite = entityImage;
  };
}

export { createEntity };
