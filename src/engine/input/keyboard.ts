export interface Keys {
  [key: string]: boolean;
}

const keyboard = (keys: Keys) => {
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    keys[e.code]=true;
  }, false);

  window.addEventListener("keyup", (e: KeyboardEvent) => {
    delete keys[e.code];
  }, false);
}

export { keyboard }
