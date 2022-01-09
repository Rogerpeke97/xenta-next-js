import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from "@fortawesome/fontawesome-svg-core";


interface linkProps {
  text: string,
  icon: IconProp
}


const FormWarning =  (props: linkProps): JSX.Element => {

 return (
  <div className="flex items-center warning">
   <FontAwesomeIcon className="icon-small" icon={props.icon} />
   <h1 className="pl-2 body-2 smooth-render font-bold">{props.text}</h1>
  </div>
 )
}


export default FormWarning;