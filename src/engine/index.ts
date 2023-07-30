import { loadImage } from './video/loadImage';
import { clear } from './video/clear';
import { drawEntity } from './entity/drawEntity';
import { createEntity } from './entity/createEntity';
import { targetEntity } from './entity/targetEntity';
import { sign } from './math/sign';
import { crudeCollision } from './collision/crude';
import { keyboard } from './input/keyboard';
import { shuffle } from './math/shuffle';
import { getEntityPos } from './entity/entityPos';
import { randomMove } from './entity/randomMove';

export default {
  loadImage,
  clear,
  randomMove,
  createEntity,
  drawEntity,
  getEntityPos,
  targetEntity,
  sign,
  shuffle,
  crudeCollision,
  keyboard
}
