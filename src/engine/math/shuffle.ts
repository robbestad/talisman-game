let shuffle = (
  array: Array<string|number> 
    ): Array<string|number> => {
  let count = array.length;
  let rnd;
  let temp;
 while( count ){
  rnd = Math.random() * count-- | 0;
  temp = array[count];
  array[count] = array[rnd];
  array[rnd] = temp
 }
 return array;
}
export {
  shuffle
}
