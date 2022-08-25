
import { World } from 'classes/game/World';
import React, {createContext, memo, MutableRefObject, useContext, useEffect, useMemo, useRef, useState} from 'react';

const StoredGameScene = createContext<any>({})

const StoredGameSceneWrapper = ({ children }: { children: Array<React.ReactElement | React.ReactElement> }) => {
  const isGameFinished = useRef(true)
  const GameWorld: MutableRefObject<World | null> = useRef(null)
  return(
    <StoredGameScene.Provider value={{isGameFinished, GameWorld}}>
      {children}
    </StoredGameScene.Provider>
  )
}

export const GameScene = () => useContext(StoredGameScene)

export default StoredGameSceneWrapper
