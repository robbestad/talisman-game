import { RefObject } from 'react';
import Game from '../engine';

const drawGameOver = (canvas: RefObject<HTMLCanvasElement>) => {
  if(canvas.current) {
  const ctx = canvas.current.getContext("2d");
  if (ctx === null) {
    return;
  }
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.font = "20px Helvetica Neue";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("Game Over", canvas.current.width / 2, canvas.current.height / 2 - 25);
}
};

export { drawGameOver };
