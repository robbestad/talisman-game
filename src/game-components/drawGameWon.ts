import { RefObject } from 'react';
import Game from '../engine';

const drawGameWon = (canvas: RefObject<HTMLCanvasElement>) => {
  if(!canvas.current) return;
  const ctx = canvas.current.getContext("2d");
  if (ctx === null) {
    return;
  }
  ctx.fillStyle = "rgb(255, 255, 255)";
  ctx.font = "24px Helvetica Neue";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("You won!", canvas.current.width / 2, canvas.current.height / 2 - 25);
  ctx.font = "20px Helvetica Neue";
  ctx.fillText("You can finally enjoy your picnic!", canvas.current.width / 2, canvas.current.height / 2);
};

export { drawGameWon };
