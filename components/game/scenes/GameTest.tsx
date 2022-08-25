import { World } from "classes/game/World"
import { useEffect } from "react"
import { GameScene } from "store/game/GameScene"

const GameTest = () => {
  const { GameWorld } = GameScene()
  useEffect(() => {
    if(!GameWorld.current){
      const canvas = document.getElementById("gameScene") as HTMLCanvasElement
      GameWorld.current = new World(canvas)
    }
  }, [])
  return(
    <div className="h-full w-full" id="gameSceneContainer">
      <canvas id="gameScene" className="w-full h-full rounded-lg" />
    </div>
  )

}

export default GameTest
