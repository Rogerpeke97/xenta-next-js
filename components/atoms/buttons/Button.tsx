import type react from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { prependOnceListener } from 'process'

interface buttonProps {
  onClick: react.MouseEventHandler,
  text: string,
  isLoading?: boolean,
  disabled?: boolean,
  icon?: IconProp,
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

  const buttonContent = (): JSX.Element => {
    return (
      <div className="flex items-center justify-center">
        {props.icon && <FontAwesomeIcon className="icon-small mr-2" icon={props.icon} color="white" />}
        <h1 className="body-2 smooth-render font-bold">{props.text}</h1>
      </div>
    )
  }

  const triggerFunctionAndUnfocus = (event: react.MouseEvent) => {
    event.preventDefault()
    props.onClick(event)
    event.currentTarget.blur()
  }

  return (
    <button disabled={props.disabled}
      className={`flex justify-center items-center ${props.color} rounded-lg`}
      onClick={triggerFunctionAndUnfocus} style={findButtonSize(props.size)}>
      {props.isLoading ? <div className="spinner"></div> : buttonContent()}
    </button>
  )
}


export default Button