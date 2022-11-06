import { World } from "classes/game/World"
import { useEffect } from "react"
import { GameScene } from "store/game/GameScene"

const GameTest = () => {
  const { GameWorld } = GameScene()
  useEffect(() => {
    const canvas = document.getElementById("gameScene") as HTMLCanvasElement
    if(!GameWorld.current){
      GameWorld.current = new World(canvas)
    } else {
      GameWorld.current.updateSceneWithNewCanvas(canvas)
    }
    return () => {
      GameWorld.current?.destroyWorld()
    }
  }, [])
  return(
    <div className="h-full w-full" id="gameSceneContainer">
      <canvas id="gameScene" className="w-full h-full rounded-lg" />
    </div>
  )

}

export default GameTest
