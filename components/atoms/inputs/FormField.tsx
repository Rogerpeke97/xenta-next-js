import type react from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'


interface formFieldProps {
  type: string,
  icon: IconProp,
  placeholder: string,
  value: string,
  onChange: react.ChangeEventHandler
}

const FormField = (props: formFieldProps): JSX.Element => {

  return (
    <div className="flex items-center input-wrapper w-full">
      <FontAwesomeIcon className="icon-small input-icon ml-3" icon={props.icon} color="#0070f3" />
      <input className="my-7" type={props.type} placeholder={props.placeholder} onChange={props.onChange} value={props.value}>
      </input>
    </div>
  )
}

export default FormField