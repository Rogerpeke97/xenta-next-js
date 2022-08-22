
import React, { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import IconButton from '@/components/atoms/buttons/IconButton'

interface Input {
  name: string
  type: string
  placeholder: string
  icon: IconDefinition
  value: string
  isValid: boolean
  warningMessage: string
}

const InputsCard = ({ title, subtitle, subtitleIcon, titleIcon, onSave, isLoading, disabled, children }: {
  title?: string, subtitle: string, titleIcon?: IconDefinition, subtitleIcon: IconDefinition,
  onSave: () => void, isLoading: boolean, disabled: boolean, children: Array<React.ReactElement> | React.ReactElement
}) => {
  const form = useRef<HTMLFormElement>(null)
  function save(e: React.FormEvent<HTMLFormElement> | React.MouseEvent) {
    e.preventDefault()
    onSave()
  }

  return (
    <div className="p-5 transition ease-out duration-300 hover:bg-hoverCard rounded-lg">
      {(title && titleIcon) ?
        <div className="pb-8 flex items-center">
          <FontAwesomeIcon className="icon-small" icon={titleIcon} color="#0070f3" fixedWidth />
          <h1 className="pl-3 subtitle-2 font-semibold">{title}</h1>
        </div> : null
      }
      <div className="pl-7 mdAndDown:px-1 flex items-center">
        <FontAwesomeIcon className="icon-small" icon={subtitleIcon} color="#0070f3" fixedWidth />
        <h1 className="pl-3 subtitle-2 font-semibold">{subtitle}</h1>
      </div>
      <form ref={form} className="px-7 mdAndDown:px-1 mdAndDown:w-full w-96">
        {children}
        <div className="pt-10">
          <IconButton color="bg-card" text="Save Changes" onClick={(e) => save(e)} 
            isLoading={isLoading} disabled={isLoading || disabled} />
        </div>
      </form>
    </div>
  )
}


export default InputsCard