import { EntityType } from "./drawEntities";

type Callback = () => void;

const removeEntity = (
  entities: Array<EntityType>,
  item: EntityType,
  callback: Callback
): Array<EntityType> => {
  callback();
  return entities =
    entities.filter((p) => {
    return p.id !== item.id;
  });
}

export { removeEntity };
