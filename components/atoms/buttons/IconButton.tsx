import type react from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

interface iconProps {
  iconName: IconProp
  iconSize: string,
  onClick?: () => void
}

const styles = [
  ['iconSmall', {
    width: '32px',
    height: '32px',
  }],
  ['iconRegular', {
    width: '45px',
    height: '45px',
  }],
  ['iconLarge', {
    width: '64px',
    height: '64px',
  }]
]

const IconButton: react.FC<iconProps> = ({ iconName, iconSize, onClick }) => {
  const findIconDefinition = () => {
    const styleForIcon = styles.find(style => style[0] === iconSize)[1]
    return styleForIcon || {}
  }
  return (
    <div className="flex items-center justify-center">
      <FontAwesomeIcon className="icon custom-button cursor-pointer" icon={iconName} color="white" onClick={() => onClick && onClick()} />
    </div>
  )
}


export default IconButton