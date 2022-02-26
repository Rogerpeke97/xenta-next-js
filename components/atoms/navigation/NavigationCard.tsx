import type react from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

interface NavCardProps {
  text: String,
  icon: IconProp,
  active: Boolean,
  onClick: react.MouseEventHandler
}

const NavigationCard: react.FC<NavCardProps> = ({ text, icon, active, onClick }) => {

  return (
    <div className={"flex my-1 h-12 card items-center justify-center rounded-full hover:text-black " + (active ? "card-active": "")} onClick={onClick}>
      <div className="flex w-4/5">
        <div className="flex items-center justify-center">
          <FontAwesomeIcon className="icon-small" color={active ? 'black' : ''} icon={icon} fixedWidth />
        </div>
        <div className="flex pl-5 grow items-center justify-start">
          <h3 className="body-1 text-white font-bold">
            {text}
          </h3>
        </div>
      </div>
    </div>
  )
}


export default NavigationCard