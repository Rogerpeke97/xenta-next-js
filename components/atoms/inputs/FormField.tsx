import type react from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { HTMLInputTypeAttribute, useState } from 'react'


interface formFieldProps {
  type: string,
  icon?: IconProp,
  placeholder: string,
  value: string,
  disabled: boolean,
  onChange: react.ChangeEventHandler
}

const FormField = (props: formFieldProps): JSX.Element => {

  const [isTextVisible, setTextVisible] = useState(false)

  const inputTypeHandler = (): HTMLInputTypeAttribute => {
    if (props.type === 'password' && isTextVisible) {
      return 'text'
    }
    return props.type
  }

  return (
    <div className="flex items-center input-wrapper w-full">
      <FontAwesomeIcon className="icon-small input-icon ml-3" icon={props.icon} color="#0070f3" />
      <input className="my-2" disabled={props.disabled} type={inputTypeHandler()} placeholder={props.placeholder} onChange={props.onChange} value={props.value}>
      </input>
      {props.type === 'password' &&
        <FontAwesomeIcon
          className="icon-small input-icon-end mr-3"
          icon={isTextVisible ? faEyeSlash : faEye} color="#020A33"
          style={{ cursor: 'pointer' }}
          onClick={() => setTextVisible(!isTextVisible)} />}
    </div>
  )
}

export default FormField