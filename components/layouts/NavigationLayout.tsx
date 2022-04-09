import { AppHelpers } from '../../context/AppHelpers'
import MenuContent from '../navigation/MenuContent'
import NavigationBar from '../navigation/NavigationBar'
import SideBar from '../navigation/SideBar'

const NavigationLayout = ({ children }: { children: React.ReactElement }) => {

  const { showSideBar, setShowSideBar } = AppHelpers()

  return (
    <div className="h-full flex w-screen">
      <SideBar />
      <div className="flex flex-col grow max-w-screen" style={{minWidth: '70vw'}}>
        <NavigationBar sideBar={[showSideBar, setShowSideBar]} />
        <MenuContent>
          {children}
        </MenuContent>
      </div>
    </div>
  )
}

export default NavigationLayout
