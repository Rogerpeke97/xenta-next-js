import MenuContent from '../molecules/navigation/MenuContent'
import NavigationBar from '../molecules/navigation/NavigationBar'
import SideBar from '../molecules/navigation/SideBar'

const NavigationLayout = ({ children }: { children: React.ReactElement }) => {

  return (
    <div className="h-full flex w-screen">
      <SideBar />
      <div className="flex flex-col grow max-w-screen" style={{minWidth: '70vw'}}>
        <NavigationBar />
        <MenuContent>
          {children}
        </MenuContent>
      </div>
    </div>
  )
}

export default NavigationLayout
