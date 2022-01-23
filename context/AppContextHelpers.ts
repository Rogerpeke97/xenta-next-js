import {createContext} from 'react';

import Api from '../pages/api/Api'

interface AppContextHelpers {
  isAuthenticated: boolean,
  currentMenu: Number,
  setCurrentMenu: Function,
  windowWidth: {description: string, size: number},
  showSideBar: boolean,
  setShowSideBar: Function,
  api: any,
  setToast: Function
}

export const AppContextHelpers = createContext<AppContextHelpers>({
  currentMenu: 0,
  isAuthenticated: false,
  setCurrentMenu: () => {},
  windowWidth: {description: '', size: 0},
  showSideBar: false,
  setShowSideBar: () => {},
  api: {},
  setToast: () => {}
});