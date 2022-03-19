

import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



const Stat = ({ stat, value, icon }: { stat: String, value: String | number, icon?: IconProp }) => {



  return (
    <div>
      <div className="flex justify-center">
        <h3 className="subtitle-1 font-bold text-card">{value}</h3>
      </div>
      <div className="flex pt-4 items-center">
        {icon && <FontAwesomeIcon className="icon-small" icon={icon} color="white" />}
        <h3 className="ml-4 subtitle-3 font-bold">{stat}</h3>
      </div>
    </div>
  )
}



export default Stat