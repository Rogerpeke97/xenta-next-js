import type react from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { HTMLInputTypeAttribute, useState } from 'react'
import FormWarning from '../forms/FormWarning'


interface formFieldProps {
  type: string,
  icon: IconProp,
  placeholder: string,
  value: string,
  disabled: boolean,
  onChange: react.ChangeEventHandler,
  isValid: boolean,
  warningMessage: string
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
    <div className="w-full">
      <div className="flex items-center input-wrapper w-full">
        <FontAwesomeIcon className="icon-small input-icon ml-3" icon={props.icon} color="#0070f3" />
        <input className="my-2 shadow-md shadow-black" disabled={props.disabled} type={inputTypeHandler()} placeholder={props.placeholder} onChange={props.onChange} value={props.value} />
        {props.type === 'password' &&
          <FontAwesomeIcon
            className="icon-small input-icon-end mr-3"
            icon={isTextVisible ? faEyeSlash : faEye} color="#E9ECEF"
            style={{ cursor: 'pointer' }}
            onClick={() => setTextVisible(!isTextVisible)} />}
      </div>
      <FormWarning isValid={props.isValid} text={props.warningMessage} icon={faExclamationCircle} />
    </div>
  )
}

export default FormField