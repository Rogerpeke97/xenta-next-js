import {createContext} from 'react';

import Api from '../pages/api/Api'

interface Lives {
  index: number;
  isActive: boolean;
}

interface GameHelpers {
  lives: Array<Lives>;
  setLives: (lives: Array<Lives>) => void;
  isCharacterBeingHit: boolean;
  intervalIds: Array<number>;
  resetFields: () => void;
  gameInterval: NodeJS.Timeout;
}

interface AppContextHelpers {
  isAuthenticated: boolean,
  currentMenu: Number,
  setCurrentMenu: Function,
  windowWidth: {description: string, size: number},
  showSideBar: boolean,
  setShowSideBar: Function,
  api: any,
  setToast: Function,
  gameHelpers: GameHelpers,
  setGameHelpers: Function
}

export const AppContextHelpers = createContext<AppContextHelpers>({
  currentMenu: 0,
  isAuthenticated: false,
  setCurrentMenu: () => {},
  windowWidth: {description: '', size: 0},
  showSideBar: false,
  setShowSideBar: () => {},
  api: {},
  setToast: () => {},
  gameHelpers: {
    lives: [
      { index: 0, isActive: true },
      { index: 1, isActive: true },
      { index: 2, isActive: true }
    ],
    setLives: (lives: Array<Lives>) => {},
    isCharacterBeingHit: false,
    resetFields: () => {},
    intervalIds: [],
    gameInterval: null
  },
  setGameHelpers: () => {},
});