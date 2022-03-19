import type react from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

interface iconProps {
  iconName: IconProp
  iconSize: string,
  onClick?: () => void,
  disabled?: boolean
}

const IconButton: react.FC<iconProps> = ({ iconName, iconSize, onClick, disabled }) => {
  return (
    <button className="flex items-center justify-center bg-primary p-2 rounded-full cursor-pointer w-10 h-10" disabled={disabled} onClick={() => onClick && onClick()}>
      <FontAwesomeIcon className={`${iconSize}`} icon={iconName} color="white" />
    </button>
  )
}


export default IconButton