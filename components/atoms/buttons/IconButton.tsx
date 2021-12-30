import type react from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

interface iconProps {
  iconName: IconProp
  link: string,
  iconSize: string
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

const IconButton: react.FC<iconProps> = ({ iconName, link, iconSize }) => {
  const findIconDefinition = () => {
    const styleForIcon = styles.find(style => style[0] === iconSize)[1]
    return styleForIcon || {}
  }
  return (
    <div className="rounded-md bg-card shadow-lg custom-button">
      <a className="flex items-center justify-center"
      href={link} target="_blank" rel="noopener noreferrer" 
      style={findIconDefinition()}
      >
        <FontAwesomeIcon className="icon" icon={iconName} />
      </a>
    </div>
  )
}


export default IconButton