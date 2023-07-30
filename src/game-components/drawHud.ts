import { RefObject } from 'react';

const drawHUD = (canvas: RefObject<HTMLCanvasElement>, score: number = 0, health: number = 100) => {
  if (canvas.current === null) {
    return;
  }
  const ctx = canvas.current.getContext("2d");
  if (ctx === null) {
    return;
  }
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "20px Helvetica Neue";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  //@ts-ignore
  ctx.fillText("SCORE: " + window.talisman?.score||0, 25, 25);
  //@ts-ignore
  ctx.fillText("DEAD: " + window.talisman.gameOver === true?"YES":"", 15, 25);
  ctx.textAlign = "right";
  ctx.fillText("Health: " + health, canvas.current.width - 35, 25);
};

export { drawHUD };
