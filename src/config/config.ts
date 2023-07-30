import { players, names } from './players';
import { beasts } from './beasts';
import { shuffle } from '../engine/math/shuffle';
import { EntityType } from '../game-components/drawEntities';

interface Backgrounds {
  title: string;
  game: string;
}

export interface Entities {
  players: EntityType[];
  projectiles: EntityType[];
  monsters: EntityType[];
  pickups: EntityType[];
  enemies: EntityType[];
}

export interface Config {
  tileSize: number;
  height: number;
  width: number;
  debug: boolean;
  beasts: typeof beasts; // Replace "typeof beasts" with the appropriate type if it's known
  backgrounds: Backgrounds;
  entities: Entities;
}

const nftData = localStorage.getItem("talisman/nftData")
const maybeWeapon = localStorage.getItem("talisman/weapon")
const nftDataParsed = nftData ? JSON.parse(nftData) : null
let name= shuffle(names).pop() as string;
let health="0";
let weapon = maybeWeapon||"fire";
if (nftDataParsed) {
  name = nftDataParsed.meta.name
  try{
  weapon = maybeWeapon||nftDataParsed.meta.attributes.filter((a: { trait_type: string, value: string }) => a.trait_type === "Weapon")[0].value
  }catch(e){

  }
  health = nftDataParsed.meta.attributes.filter((a: { trait_type: string, value: string }) => a.trait_type === "Health")[0].value
}
const config: Config = {
  tileSize: 32,
  height: 512,
  width: 512,
  debug: true,
  beasts: beasts,
  backgrounds: {
    title: '/assets/title.png',
    game: '/assets/board512_grass.png'
  },
  entities: {
    players: [{
      name: name, 
      weapon: weapon,
      image: shuffle(players).pop() as string,
      health: 100+parseInt(health),
      width: 32,
      height: 32,
      id: 'player',
      direction: 'x',
      vel: {
        x: 0,
        y: 0
      },
      tick: 0.01,
      pos: {
        x: 8,
        y: 8
      },
      speed: 1
    }],
    projectiles: [],
    monsters: [],
    pickups: [],
    enemies: []
  }
}

export { config }
