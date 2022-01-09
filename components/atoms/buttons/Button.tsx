import type react from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { prependOnceListener } from 'process'

interface buttonProps {
  onClick: react.MouseEventHandler,
  text: string,
  isLoading?: boolean,
  color: string
}

const buttonStyle = {
  width: '200px',
  height: '50px',
}

const Button = (props: buttonProps): JSX.Element => {

  return (
    <button disabled={props.isLoading}
      className={`flex justify-center items-center px-1 ${props.color} rounded-lg`}
      onClick={props.onClick} style={buttonStyle}>
      {props.isLoading ? <div className="spinner"></div> : <h1 className="body-1 text-ellipsis overflow-hidden nowrap mx-1 font-bold smooth-render">{props.text}</h1>}
    </button>
  )
}


export default Button