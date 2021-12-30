import {createContext} from 'react';

interface NavigationMenuState {
  currentMenu: Number,
  setCurrentMenu: Function
}

export const NavigationMenuState = createContext<NavigationMenuState>({
  currentMenu: 0,
  setCurrentMenu: () => {}
});