
import Game from '@/components/game/scenes/Game';
import React, {createContext, memo, useContext, useEffect, useMemo, useRef, useState} from 'react';

const StoredGameScene = createContext<any>({})

const StoredGameSceneWrapper = ({ children }: { children: Array<React.ReactElement | React.ReactElement> }) => {
  const isGameFinished = useRef(true)
  const game = () => {
    return (
      <>
        <Game isGameFinished={isGameFinished} />
      </>
    )
  }
  const GameSceneMemoized = React.memo(game)
  return(
    <StoredGameScene.Provider value={{GameSceneMemoized, isGameFinished}}>
      {children}
    </StoredGameScene.Provider>
  )
}

export const GameScene = () => useContext(StoredGameScene)

export default StoredGameSceneWrapper
