import {createContext} from 'react';

interface NavigationMenuState {
  currentMenu: Number,
  setCurrentMenu: Function,
  windowWidth: String,
}

export const NavigationMenuState = createContext<NavigationMenuState>({
  currentMenu: 0,
  setCurrentMenu: () => {},
  windowWidth: '',
});