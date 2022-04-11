

import { faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
    const mobileDefaultClass = 'mdAndDown:device-height inset-0 w-full '
    const defaultClass = 'fixed dialog bg-primary '
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
      <div className="flex w-full justify-end pr-1">
        <FontAwesomeIcon icon={faTimes} className="icon cursor-pointer transition ease-out duration-300 hover:text-card" onClick={() => setShowDialog('hide')} />
      </div>
        {children}
      </div>
    </div>
  )
}



export default Dialog