import { Ref, RefObject } from 'react';
import Game from '../engine';
import { EntityType } from './drawEntities';


const checkCollision = (
  canvas: RefObject<HTMLCanvasElement>,
  player: EntityType,
  monster: EntityType,
  cb: (monster: EntityType, canvas: RefObject<HTMLCanvasElement>) => void,
  score: ()=>void
) => {
  const collides = Game.crudeCollision(player, monster, 32);
  if(collides) {
    score();

    const ctx = canvas.current!.getContext("2d");
    if (ctx !== null) {
      ctx.fillStyle = "rgb(250, 250, 250)";
      ctx.font = "12px Helvetica";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText("Ouch", player.pos.x, player.pos.y-24);
    }

    cb(monster, canvas);
  }
}

export { checkCollision };
