import { RefObject } from 'react';
import { createEntity } from './createEntity';
import { EntityType } from '../../game-components/drawEntities';

interface Position {
  x: number;
  y: number;
}

const drawEntity = (
  canvas: RefObject<HTMLCanvasElement>,
  entity: EntityType
): void => {
  if (entity._creating && !entity._sprite) {
    return;
  } else if (!entity._sprite) {
    createEntity(entity);
  } else {
    // draw the sprite as soon as the image
    // is ready
    var ctx = canvas.current!.getContext("2d");
    if (ctx !== null) {
      ctx.drawImage(
        entity._sprite,
        entity.pos.x,
        entity.pos.y
      );
    }
  }
}

export { drawEntity };
