

import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRef, useState } from 'react'
import IconButton from '../../atoms/buttons/IconButton'



const Dialog = ({children, onOpen}: {children: React.ReactElement, onOpen: () => void}) => {

  const [showDialog, setShowDialog] = useState(false)


  const dialog = useRef<HTMLDivElement>(null)

  function setUpClickOutsideDialog(){
    if(dialog.current) {
      dialog.current.onclick = (e) => {
        if(e.target === dialog.current) {
          setShowDialog(false)
        }
      }
    }
  }

  return (
    <div ref={dialog}>
      <IconButton iconName={faPencilAlt} onClick={() => setShowDialog(true)} iconSize={'icon-small'} />
      <div className={`absolute pop-in ${!showDialog && 'hidden'} h-40 w-40 bg-white`}>
        {children}
      </div>
    </div>
  )
}



export default Dialog