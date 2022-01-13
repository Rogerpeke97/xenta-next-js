import {createContext} from 'react';

import Api from '../pages/api/Api'

interface NavigationMenuState {
  currentMenu: Number,
  setCurrentMenu: Function,
  windowWidth: {description: string, size: number},
  showSideBar: boolean,
  setShowSideBar: Function,
  api: Api
}

export const NavigationMenuState = createContext<NavigationMenuState>({
  currentMenu: 0,
  setCurrentMenu: () => {},
  windowWidth: {description: '', size: 0},
  showSideBar: false,
  setShowSideBar: () => {},
  api: new Api()
});