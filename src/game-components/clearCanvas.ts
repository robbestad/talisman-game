import { RefObject } from 'react';
import Game from '../engine';

const clearCanvas = (
  canvas: RefObject<HTMLCanvasElement>,
) => {
  if(!canvas.current) {
    return;
  }
  const ctx = canvas.current.getContext("2d");
  if (ctx !== null) {
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
  }
}

export { clearCanvas };
