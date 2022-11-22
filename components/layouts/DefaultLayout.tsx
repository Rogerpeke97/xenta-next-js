import { useEffect } from 'react'
import { AppHelpers } from '../../context/AppHelpers'
import Toast from '../atoms/notifications/Toast'
import NavigationLayout from './NavigationLayout'

const DefaultLayout = ({ children }: { children: React.ReactElement }) => {
  const { toast } = AppHelpers()
  const displayToast = () => {
    if (!toast || !toast.displayToast) return
    return (
      toast.messages.map((message: string, index: number) => <Toast key={index} text={message.message} type={message.type} />)
    )
  }

  return (
    <>
      <div className="device-height smooth-render-long">
        <NavigationLayout>
          {children}
        </NavigationLayout>
      </div>
      <div id="modal" />
      {displayToast()}
    </>
  )
}
export default DefaultLayout
