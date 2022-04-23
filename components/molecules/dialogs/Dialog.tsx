

import { faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { Component, useCallback, useEffect, useRef, useState } from 'react'
import IconButton from '../../atoms/buttons/IconButton'
import ReactDOM from 'react-dom'



const Dialog = ({children, onOpen, Activator}: {children: React.ReactElement, onOpen: () => void, Activator: React.ReactElement}) => {

  const [showDialog, setShowDialog] = useState('')

  const dialog = useRef<HTMLDivElement>(null)

  const setUpClickListenerToCloseDialog = (event: MouseEvent) => {
    if(showDialog !== 'show') return
    if (dialog.current !== event.target && !dialog.current?.contains(event.target as Node)) {    
      setShowDialog('hide')
    }
  }

  const dialogStateClass = () => {
    const defaultClass = `fixed inset-0 w-full h-full ${showDialog === 'show' && 'bg-black bg-opacity-40'} `
    if(showDialog === 'hide'){
      return defaultClass + 'pop-out-fade'
    }
    if(showDialog === 'show'){
      return defaultClass + 'pop-in-fade'
    }
    return 'hidden'
  }

  useEffect(() => {
    ReactDOM.render(
      <div className={dialogStateClass()}>
        <div ref={dialog} className="fixed m-auto rounded-lg max-w-[700px] max-h-[700px] bg-hoverCard mdAndDown:max-h-full inset-0 w-full p-4">
          <div className="flex w-full justify-end">
            <FontAwesomeIcon icon={faTimes} className="icon cursor-pointer transition ease-out duration-300 hover:text-card" onClick={() => setShowDialog('hide')} />
          </div>
          {children}
        </div>
      </div>, document.getElementById('modal')
    )
  }, [showDialog, children])

  useEffect(() => {
    window.addEventListener('click', setUpClickListenerToCloseDialog)
    return () => {
      window.removeEventListener('click', setUpClickListenerToCloseDialog)
    } 
  }, [showDialog])

  return (
    <>
      {React.cloneElement(Activator, {onClick: () => setShowDialog('show')})}
    </>
  )
}



export default Dialog