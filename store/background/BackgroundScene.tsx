
import { BackgroundScene } from 'classes/background/BackgroundScene';
import React, {createContext, memo, MutableRefObject, useContext, useRef} from 'react';

const StoredBackgroundScene = createContext<any>({})

const StoredBackgroundSceneWrapper = ({ children }: { children: Array<React.ReactElement> | React.ReactElement }) => {
  const StoredBackground: MutableRefObject<BackgroundScene | null> = useRef(null)
  return(
    <StoredBackgroundScene.Provider value={{StoredBackground}}>
      {children}
    </StoredBackgroundScene.Provider>
  )
}

export const BackgroundSceneStore = () => useContext(StoredBackgroundScene)

export default StoredBackgroundSceneWrapper
