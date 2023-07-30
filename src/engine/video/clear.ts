import { RefObject } from "react";

const clear = (canvas: RefObject<HTMLCanvasElement>) => {
  if(!canvas.current) return;
  const ctx = canvas.current.getContext('2d');
  if (ctx) { // getContext might return null if context identifier is not supported
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
  }
};

export {
  clear
}
