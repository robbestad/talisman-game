interface Position {
  x: number;
  y: number;
}

interface Item {
  pos: Position;
}

interface Bounds {
  height: number;
  width: number;
}

const outOfBounds = (
  item: Item = {pos: {x: 160, y: 160}},
  bounds: Bounds = {height: 16, width: 16},
  tileSize: number = 32
): boolean => {
  if( item.pos.y< -tileSize ||
     item.pos.x< -tileSize ||
     item.pos.y > bounds.height+tileSize ||
     item.pos.x > bounds.width+tileSize
    ){
    return true;
  }
  return false;
}

export { outOfBounds };
