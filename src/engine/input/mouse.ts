import { RefObject } from 'react';
import { getEntityPos } from '../entity/entityPos';

const getMousePos = (canvas: RefObject<HTMLCanvasElement>, e: MouseEvent): {x: number, y: number} => {
  const rect = canvas.current!.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

const mouse = (canvas: RefObject<HTMLCanvasElement>, tileSize: number) => {
  if(!canvas.current) return;
  canvas.current.addEventListener('mousemove', function(e) {
    const mousePos = getMousePos(canvas, e);
    const entityPos = getEntityPos(tileSize, mousePos);
    const message = 'Tile: ' + entityPos.x+ ',' + entityPos.y;
    console.log(message);
  }, false);
}

export { mouse }
