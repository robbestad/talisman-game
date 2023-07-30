import { Keys } from "../../engine/input/keyboard";

const a = (keys: Keys): boolean => {
  return keys.KeyA || false;
};
const d = (keys: Keys): boolean => {
  return keys.KeyD || false;
};
const down = (keys: Keys): boolean => {
  return keys.ArrowDown || false;
};

const left = (keys: Keys): boolean => {
  return keys.ArrowLeft || false;
};

const right = (keys: Keys): boolean => {
  return keys.ArrowRight || false;
};

const s = (keys: Keys): boolean => {
  return keys.KeyS || false;
};

const space = (keys: Keys): boolean => {
  return keys.Space || false;
};

const up = (keys: Keys): boolean => {
  return keys.ArrowUp|| false;
};

const w = (keys: Keys): boolean => {
  return keys.KeyW|| false;
};

export { a, d, down, left, right, s, space, up, w };



