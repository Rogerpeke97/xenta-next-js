

import { faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component, useEffect, useRef, useState } from 'react'
import IconButton from '../../atoms/buttons/IconButton'



const Dialog = ({children, onOpen, Activator}: {children: React.ReactElement, onOpen: () => void, Activator: React.ReactElement}) => {

  const [showDialog, setShowDialog] = useState('')

  const dialog = useRef<HTMLDivElement>(null)

  const setUpClickListenerToCloseDialog = (event: MouseEvent) => {
    if (dialog.current !== event.target && !dialog.current?.contains(event.target as Node) && showDialog) {    
      setShowDialog('hide')
    }
  }

  const dialogStateClass = () => {
    const defaultClass = 'fixed inset-0 w-full h-full bg-white '
    if(showDialog === 'hide'){
      return defaultClass + 'pop-out-fade'
    }
    if(showDialog === 'show'){
      return defaultClass + 'pop-in-fade'
    }
    return 'hidden'
  }

  useEffect(() => {
    window.addEventListener('click', setUpClickListenerToCloseDialog)
    console.log(Activator)
    console.log(children)
    return () => {
      window.removeEventListener('click', setUpClickListenerToCloseDialog)
    } 
  }, [showDialog])

  return (
    <div ref={dialog}>
      {React.cloneElement(Activator, {onClick: () => setShowDialog('show')})}
        <div className={dialogStateClass()}>
          <div className="dialog bg-hoverCard mdAndDown:device-height inset-0 w-full">
            <div className="flex w-full justify-end pr-1">
              <FontAwesomeIcon icon={faTimes} className="icon cursor-pointer transition ease-out duration-300 hover:text-card" onClick={() => setShowDialog('hide')} />
            </div>
            {children}
          </div>
        </div>
    </div>
  )
}



export default Dialog