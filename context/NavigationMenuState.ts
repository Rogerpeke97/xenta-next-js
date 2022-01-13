import {createContext} from 'react';

interface NavigationMenuState {
  currentMenu: Number,
  setCurrentMenu: Function,
  windowWidth: {description: string, size: number},
  showSideBar: boolean,
  setShowSideBar: Function
}

export const NavigationMenuState = createContext<NavigationMenuState>({
  currentMenu: 0,
  setCurrentMenu: () => {},
  windowWidth: {description: '', size: 0},
  showSideBar: false,
  setShowSideBar: () => {}
});