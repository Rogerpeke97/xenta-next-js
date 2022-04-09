import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
export interface StatType {
  stat: string
  value: string | number
  icon: IconProp
}


const Stat = ({ stat, value, icon }: { stat: String, value: String | number, icon?: IconProp }) => {



  return (
    <div>
      <div className="flex justify-center">
        <h3 className="mdAndDown:text-md text-lg font-bold text-card">{value}</h3>
      </div>
      <div className="flex pt-4 items-center">
        {icon && <FontAwesomeIcon className="icon-small" icon={icon} color="white" />}
        <h3 className="ml-2 mdAndDown:text-sm text-md font-bold">{stat}</h3>
      </div>
    </div>
  )
}



export default Stat