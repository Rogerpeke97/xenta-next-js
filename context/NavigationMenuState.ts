import {createContext} from 'react';

interface NavigationMenuState {
  currentMenu: any,
  setCurrentMenu: Function
}

export const NavigationMenuState = createContext<NavigationMenuState>({
  currentMenu: null,
  setCurrentMenu: () => {}
});