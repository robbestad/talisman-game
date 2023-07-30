import { Entities } from "./config/config";
interface Keys {
  [key: string]: boolean;
}

type Position = {
  x: number;
  y: number;
};
interface Talisman {
  score: number;
  level: number;
  experience: number;
  restartGame: boolean;

  gameOver: boolean;
  beast: any; // Replace with the actual type if known
  maxMonsters: number;
  monstersSpawned: number;
  cooldown: number;
  currentPlayer:string;
  currentPlayerNo:number;
  entities: Entities;
  gameWon:boolean;
  keys:Keys;
  position: Position
  gameNumber:number;
}

interface Window {
  talisman: Talisman;
}
declare global {
  interface Window {
    talisman: {
      gameNumber: number;
      restartGame: boolean;
      score: number;
      experience: number;
      level: number;
      gameOver: boolean;
      beast: any; // Replace with the actual type if known
      maxMonsters: number;
      monstersSpawned: number;
      cooldown: number;
      currentPlayerNo:number;
      entities: Entities;
      gameWon:boolean;
      keys:Keys;
      position: Position
    };
  }
}