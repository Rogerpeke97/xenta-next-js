import type react from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { prependOnceListener } from 'process'

interface buttonProps {
  onClick: react.MouseEventHandler,
  text: string,
  isLoading?: boolean,
  color: string,
  size: string
}

const buttonStyles = [
  { size: 'small', style: { width: '110px', height: '32px', fontSize: '14px' } },
  { size: 'regular', style: { width: '150px', height: '45px', fontSize: '16px' } },
  { size: 'large', style: { width: '200px', height: '64px', fontSize: '24px' } }
]

const Button = (props: buttonProps): JSX.Element => {
  const findButtonSize = (size: string) => {
    const styleForButton = buttonStyles.find(style => style.size === size)
    return styleForButton?.style || {}
  }

  return (
    <button disabled={props.isLoading}
      className={`flex justify-center items-center px-1 ${props.color} rounded-lg`}
      onClick={props.onClick} style={findButtonSize(props.size)}>
      {props.isLoading ? <div className="spinner"></div> : <h1 className="text-ellipsis overflow-hidden nowrap mx-1 font-bold smooth-render">{props.text}</h1>}
    </button>
  )
}


export default Button