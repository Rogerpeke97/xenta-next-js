import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from "@fortawesome/fontawesome-svg-core";


interface linkProps {
  text: string,
  icon: IconProp,
  isValid: boolean
}


const FormWarning =  (props: linkProps): JSX.Element => {

 return (
  <div className="flex items-center warning h-5 py-5">
    {!props.isValid && 
    <>
      <FontAwesomeIcon className="icon-small" icon={props.icon} />
      <h3 className="pl-2 body-2 smooth-render font-bold">{props.text}</h3>
    </>
    }
  </div>
 )
}


export default FormWarning;