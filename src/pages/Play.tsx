import { useAnchorWallet } from "@solana/wallet-adapter-react"
import { Entities, config } from "../config/config"
import Game from "../engine"
import { addEntity } from "../game-components/addEntity"
import { addProjectile } from "../game-components/addProjectile"
import { checkCollision } from "../game-components/checkCollision"
import { clearCanvas } from "../game-components/clearCanvas"
import { EntityType, drawEntities } from "../game-components/drawEntities"
import { drawGameOver } from "../game-components/drawGameOver"
import { drawGameWon } from "../game-components/drawGameWon"
import { drawHUD } from "../game-components/drawHud"
import { keyInput } from "../game-components/keyInput"
import { outOfBounds } from "../game-components/outOfBounds"
import { setupGame } from "../game-components/setupGame"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"

export default function Play({ isDark }: { isDark: boolean }) {
  const wallet = useAnchorWallet()
  const [gameStarted, setGameStarted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    toast.success("Welcome to Talisman")
  }, [])
  useEffect(() => {
    if(window.talisman.experience > 0 && !gameStarted){
    toast.success(`Wow, you gained ${window.talisman.experience} experience point(s)!`)
    }
  }, [gameStarted])
  window.talisman = {
    gameNumber: 0,
    restartGame: false,
    score: 0,
    level: 1,
    experience: 0,
    gameOver: false,
    beast: null,
    maxMonsters: 3,
    monstersSpawned: 0,
    cooldown: 0,
    entities: config.entities,
    currentPlayerNo: 0,
    gameWon: false,
    position: { x: 0, y: 0 },
    keys: {}
  };
  let talisman = window.talisman;
  const { entities, score, gameOver, gameWon, cooldown, position, keys, currentPlayerNo, maxMonsters, monstersSpawned, beast } = talisman;
  const currentPlayer = entities.players[currentPlayerNo]
  var lastTime = performance.now(); // Use performance.now for more precise timing

  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setupGame(config, keys, canvasRef, entities, position);
    window.talisman.maxMonsters = 3
    window.talisman.monstersSpawned = 0
    lastTime = Date.now();

    const loop = (time: number) => {
      var now = performance.now(); // Get current time in milliseconds
      var deltaTime = (now - lastTime) / 1000; // Calculate deltaTime in seconds
      lastTime = now; // Update lastTime for the next frame
      window.talisman.experience += 1;

      //console.log(deltaTime); // Print deltaTime
      if (window.talisman.monstersSpawned === window.talisman.maxMonsters) {
        if (window.talisman.entities.monsters.length === 0) {
          window.talisman.monstersSpawned = 0;
          window.talisman.maxMonsters += 1;
          window.talisman.level += 1;
        }
      }

      updateGame(deltaTime); // If updateGame depends on delta, pass it here
      requestAnimationFrame(loop);
    };
    loop(0);
  }, [config, gameStarted]);

  useEffect(() => {
    if (gameStarted)
      startGame();
  }, [config, gameStarted]);

  function addProjectileAndPush
    (item: EntityType) {
    window.talisman.entities.projectiles.push(item)
  }
  function updateGame(deltaTime: number) {
    if (canvasRef.current === null) return {}
    const canvas: HTMLCanvasElement = canvasRef.current
    const ctx = canvas.getContext("2d")
    let { score, experience, gameOver, entities, gameWon, level, cooldown, position, keys, currentPlayerNo, maxMonsters, monstersSpawned, beast } = window.talisman;
    if (currentPlayer.health < 1 || gameWon) {
      window.talisman.entities.monsters = []
      window.talisman.entities.projectiles = []
      window.talisman.gameOver = true
      setGameStarted(false);
      
    }
    if (window.talisman.gameOver) {
      const gameOverImage = new Image()
      //let gameOverImage = ctx.getImageData(0, 0, canvas.width, canvas.height)
      gameOverImage.src = "/assets/gameover.png"
      gameOverImage.onload = () => {
        clearCanvas(canvasRef) // Assuming clearCanvas only clears the canvas
        ctx?.drawImage(gameOverImage, 0, 0) // Draw the image at the top-left corner

        if (gameWon) {
          drawGameWon(canvasRef)
          drawGameOver(canvasRef)
        }
        setTimeout(() => {
          //window.location.reload()
        }, 1500)
      }
    }

    if (!gameOver) {
      drawEntities(config, canvasRef, entities)

      drawHUD(canvasRef, score, currentPlayer.health)

      keyInput(config, keys, currentPlayer, 1, addProjectile, addProjectileAndPush);

      // move projectiles each tick
      for (let projectile of entities.projectiles) {
        projectile.pos.x += projectile.vel.x * deltaTime;
        projectile.pos.y += projectile.vel.y * deltaTime;

        for (let monster of entities.monsters) {
          if (Game.crudeCollision(projectile, monster, config.tileSize / 2)) {
            console.log(projectile)
            if(projectile.name==="lightning"){
              monster.health -= 50
            }else if (projectile.name==="bolt"){
              monster.health -= 20
            }else{
              monster.health -= 10
            }

            if (monster.health <= 0) {
              window.talisman.entities.monsters = entities.monsters.filter((mob: EntityType) => mob !== monster)
              window.talisman.score += 1;
            }
          }
          if (entities.monsters.length === 0) {
            window.talisman.level += 1;
            window.talisman.monstersSpawned = 0;
            window.talisman.maxMonsters += 1;
          }
        }

        if (outOfBounds(projectile, { height: config.height, width: config.width }, config.tileSize)) {
          window.talisman.entities = {
            ...entities,
            projectiles: entities.projectiles.filter((mob: EntityType) => mob.id !== projectile.id)
          }
        }
      }
      // move monsters each tick
      if (!gameOver) {
        entities.monsters.forEach((monster: EntityType) => {
          if (Game.crudeCollision(monster, currentPlayer, 64)) {
            Game.targetEntity(monster, currentPlayer, monster.speed)
          }
          Game.randomMove(monster, monster.speed, deltaTime || 1, config)

          checkCollision(
            canvasRef,
            currentPlayer,
            monster,
            () => {
              currentPlayer.health -= 1
            },
            () => {
              score -= 1
            }
          )
        })
      }

      if (!gameOver && level <= 14) {
        if (monstersSpawned < maxMonsters) {
          let beast = config.beasts[level - 1]
          window.talisman.monstersSpawned += 1;
          addEntity(
            beast,
            {
              x: Game.shuffle([64, 256, 480])[0] as number,
              y: Game.shuffle([-32, 520])[0] as number,
            },
            20 + score,
            1 + (Math.random() * score) / 10,
            (item) => entities.monsters.push(item)
          )
        }
      }

      if (level > 14) {
        window.talisman.gameOver = true
        window.talisman.gameWon = true
      }
    }
    return {}
  }
  let isGameOver = window.talisman.gameOver;
  return (<>
  <Toaster />
    <div className="info m-auto w-full text-center">
      Player: {currentPlayer.name}
    </div>
    <div className="bg-cover bg-center relative" style={{backgroundImage: "url('https://shdw-drive.genesysgo.net/Aqn5ACrx2tsnnoKkJNoBnuBHX5nitSnaYA9h7tcK7iqg/00000_D5kEinb4KKg1sB8DGijDz.png')"}}>
      <canvas
        ref={canvasRef}
        id="canvas"
        className="m-auto"
        height={config.height}
        width={config.width}
      >
        Sorry, your browser doesn't support canvas
      </canvas>

      {!wallet ? <div className={`absolute top-0 left-[25%] w-[512px] h-[512px] border-gray-900 dark:border-gray-400 m-auto`}>
        
        <p className="text-center mt-8 bg-slate-800/90">Connect wallet to play</p>
      </div> : null}
      {isGameOver || !gameStarted ? <div className="w-full justify-center flex gap-2 absolute top-[100px]">
        {wallet ? <button className="p-2 border bg-slate-800/90 rounded hover:rounded-lg font-bold active:scale-95" onClick={function () {
          window.talisman.restartGame = true;
          window.talisman.gameOver = false
          window.talisman.gameWon = false
          window.talisman.score = 0
          window.talisman.level = 1
          window.talisman.experience = 0
          window.talisman.currentPlayerNo = 0
          window.talisman.maxMonsters = 3
          window.talisman.monstersSpawned = 0
          window.talisman.entities.players[0].health = 100
          window.talisman.entities.monsters = []
          window.talisman.entities.projectiles = []
          window.talisman.entities.players[0].pos.x = 8;
          window.talisman.entities.players[0].pos.y = 8;
          setGameStarted(true);
        }}>Start</button> : null}
         {wallet ? <Link to="/"> <button className="p-2 bg-slate-800/90 border rounded hover:rounded-lg font-bold active:scale-95">
        Menu & Shop
      </button></Link>:null}
      </div> : null}
    </div></>
  )
}
