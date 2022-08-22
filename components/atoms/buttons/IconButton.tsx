import type react from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { prependOnceListener } from 'process'

interface buttonProps {
  onClick: react.MouseEventHandler,
  text?: string,
  className?: string,
  isLoading?: boolean,
  disabled?: boolean,
  icon?: IconProp,
  color?: string,
  size?: string,
  title?: string
}
const buttonStyles = [
  { size: 'xs', style: { height: '32px', fontSize: '12px' } },
  { size: 'sm', style: { minWidth: '110px', maxWidth: '150px', height: '32px', fontSize: '16px' } },
  { size: 'md', style: { minWidth: '150px', maxWidth: '200px', height: '45px', fontSize: '20px' } },
  { size: 'lg', style: { minWidth: '200px', maxWidth: '300px', height: '64px', fontSize: '24px' } }
]

const IconButton = (props: buttonProps): JSX.Element => {
  const findButtonSize = (size='md') => {
    const styleForButton = buttonStyles.find(style => style.size === size)
    return styleForButton?.style || {}
  }
  const buttonContent = (): JSX.Element => {
    return (
      <div className="flex max-w-full items-center justify-center">
        {props.icon && <FontAwesomeIcon className={`icon-small ${props.text ? 'mr-2' : ''}`} icon={props.icon} color="white" />}
        {props.text && <h1 className="min-w-0 truncate font-bold">{props.text}</h1>}
      </div>
    )
  }
  const triggerFunctionAndUnfocus = (event: react.MouseEvent) => {
    event.preventDefault()
    props.onClick(event)
    event.currentTarget.blur()
  }

  return (
    <button disabled={props.disabled} title={props.title}
      className={`shadow-md shadow-black flex justify-center px-5 items-center ${props.color} rounded-lg ${props.className}`}
      onClick={triggerFunctionAndUnfocus} style={findButtonSize(props.size)}>
      {props.isLoading ? <div className="spinner"></div> : buttonContent()}
    </button>
  )
}

export default IconButton
