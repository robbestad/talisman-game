const getEntityPos = (
  tileSize: number,
  pos: {x: number, y: number}
): {x: number, y: number} => {
  const column = Math.ceil(
    Number(pos.x / tileSize )
  );
  const row = Math.ceil(
    Number(pos.y / tileSize )
  );
  return {x: column, y: row}
}

export { getEntityPos }
