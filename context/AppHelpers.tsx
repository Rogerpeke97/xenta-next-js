import {createContext, useContext, useEffect, useState} from 'react';
import Api from '../pages/api/Api';

interface Lives {
  index: number;
  isActive: boolean;
}

interface GameHelpers {
  lives: Array<Lives>;
  setLives: (lives: Array<Lives>) => void;
  intervalIds: Array<number>;
  isCharacterBeingHit: boolean;
  resetFields: () => void;
  gameInterval: NodeJS.Timeout | null;
}

const AppContextHelpers = createContext<any>({})

const AppHelpersWrapper = ({ children }: { children: Array<React.ReactElement> }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [currentMenu, setCurrentMenu] = useState<Number>(0)

  const [windowWidth, setWindowWidth] = useState({ description: '', size: 0 })

  const [showSideBar, setShowSideBar] = useState(false)

  const [api, setApi] = useState<Api>()

  useEffect(() => {
    const apiInit = new Api()
    setApi(apiInit)
  }, [])

  const [gameHelpers, setGameHelpers] = useState<GameHelpers>({
    lives: [
      { index: 0, isActive: true },
      { index: 1, isActive: true },
      { index: 2, isActive: true }
    ],
    setLives: (lives: Array<Lives>) => {
      setGameHelpers({ ...gameHelpers, lives })
    },
    isCharacterBeingHit: false,
    intervalIds: [],
    resetFields: () => {
      gameHelpers.intervalIds.forEach((id, index) => {
        clearInterval(id)
      })
      gameHelpers.intervalIds = []
      setGameHelpers({
        ...gameHelpers,
        lives: [
          { index: 0, isActive: true },
          { index: 1, isActive: true },
          { index: 2, isActive: true }
        ],
        isCharacterBeingHit: false,
        gameInterval: null
      })
    },
    gameInterval: null
  })

  const [toast, setToast] = useState({
    messages: [{message: '', type: ''}],
    displayToast: false
  })

  return(
    <AppContextHelpers.Provider value={{
      isAuthenticated, setIsAuthenticated, currentMenu, setCurrentMenu,
      windowWidth, setWindowWidth, showSideBar, setShowSideBar, api, setApi,
      gameHelpers, setGameHelpers, toast, setToast
    }}>
      {children}
    </AppContextHelpers.Provider>
  )
}

export const AppHelpers = () => useContext(AppContextHelpers)

export default AppHelpersWrapper