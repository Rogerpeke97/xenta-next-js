import type react from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faExclamationTriangle, faCheck, faQuestionCircle, faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react'


interface toastProps {
  text: string,
  type: string
}

const toastStyles = [
  { type: 'success', icon: faCheck, style: { backgroundColor: 'var(--success)' } },
  { type: 'error', icon: faExclamationTriangle, style: { backgroundColor: 'var(--warning)' } }
]

const Toast = (props: toastProps): JSX.Element => {

  const toast = useRef<HTMLDivElement>(null)

  const findToastIcon = (type: string) => {
    return toastStyles.find(style => style.type === type)?.icon || faQuestionCircle
  }

  const findStyle = (type: string) => {
    return toastStyles.find(style => style.type === type)?.style || {}
  }

  const removeToast = () => {
    setDisplayToast(false)
    const toastContent = toast?.current
    if(toastContent) {
      toastContent.onanimationend = () => {
        setAnimationStatus('finished')
      }
    }
  }

  useEffect(() => {
    setTimeout(() => removeToast(), 5000)
  }, [])

  const [animationStatus, setAnimationStatus] = useState('')

  const [displayToast, setDisplayToast] = useState(true)

  return (
    <div ref={toast} className={`toast flex flex-col rounded-lg pop-in ${!displayToast && 'fade-out '} ${animationStatus === 'finished' && 'hidden'}`}
      style={findStyle(props.type)}>
      <div className="flex h-5 pr-1 justify-end">
        <FontAwesomeIcon className="icon-small icon-hover" icon={faWindowClose} onClick={() => removeToast()} />
      </div>
      <div className="flex grow justify-center">
        <FontAwesomeIcon className="icon-small" icon={findToastIcon(props.type)} />
        <h1 className="pl-2 body-2 font-bold">{props.text}</h1>
      </div>
    </div>
  )
}


export default Toast