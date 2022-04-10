

import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react'
import IconButton from '../../atoms/buttons/IconButton'



const Dialog = ({children, onOpen}: {children: React.ReactElement, onOpen: () => void}) => {

  const [showDialog, setShowDialog] = useState('')

  const dialog = useRef<HTMLDivElement>(null)

  const setUpClickListenerToCloseDialog = (event: MouseEvent) => {
    if (dialog.current !== event.target && !dialog.current?.contains(event.target as Node)) {    
      setShowDialog('hide')
    }
  }

  const dialogStateClass = () => {
    const mobileDefaultClass = 'mdAndDown:ml-0 device-height w-full '
    const defaultClass = 'absolute h-96 w-96 top-0 left-0 -ml-24 bg-white '
    if(showDialog === 'hide'){
      return defaultClass + mobileDefaultClass + 'pop-out'
    }
    if(showDialog === 'show'){
      return defaultClass + mobileDefaultClass + 'pop-in'
    }
    return 'hidden'
  }


  useEffect(() => {
    window.addEventListener('click', setUpClickListenerToCloseDialog)
    return () => {
      window.removeEventListener('click', setUpClickListenerToCloseDialog)
    } 
  }, [])

  return (
    <div ref={dialog}>
      <IconButton iconName={faPencilAlt} onClick={() => setShowDialog('show')} iconSize={'icon-small'} />
      <div className={dialogStateClass()}>
        {children}
      </div>
    </div>
  )
}



export default Dialog