
import React, { useRef } from 'react'
import FormField from '../../atoms/inputs/FormField'
import FormWarning from '../../atoms/forms/FormWarning'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { validatePassword, validateRepeatPassword, validateUserName, validateEmail } from "../../../plugins/validators/inputValidator"
import Button from '../../atoms/buttons/Button'


interface Input {
  name: string
  type: string
  placeholder: string
  icon: IconDefinition
  value: string
  isValid: boolean
  warningMessage: string
}


const InputsCard = ({ title, subtitle, subtitleIcon, titleIcon, inputsAttrs, setInputsAttrs, onSave, isLoading }: {
  title?: string, subtitle: string, titleIcon?: IconDefinition, subtitleIcon: IconDefinition, inputsAttrs: Array<Input>,
  setInputsAttrs: (attrs: Array<Input>) => void, onSave: () => void, isLoading: boolean
}) => {

  const form = useRef<HTMLFormElement>(null)


  function validateInput(newValue: string, input: Input, index: number) {
    const validationsByInputName = [
      { name: 'name', validate: (name: string) => validateUserName(name), isValidName: 'isValidName' },
      { name: 'oldPassword', validate: (oldPassword: string) => validatePassword(oldPassword), isValidName: 'isValidOldPassword' },
      {
        name: 'newPassword',
        validate: (newPassword: string) => {
          let repeatPassword = inputsAttrs.find(input => input.name === 'repeatNewPassword')?.value || ''
          if (input.name === 'repeatNewPassword') {
            repeatPassword = newValue
          }
          return validateRepeatPassword(newPassword, repeatPassword)
        },
        isValidName: 'isValidNewPassword'
      },
      {
        name: 'repeatNewPassword',
        validate: (repeatNewPassword: string) => {
          let newPassword = inputsAttrs.find(input => input.name === 'newPassword')?.value || ''
          if (input.name === 'newPassword') {
            newPassword = newValue
          }
          return validateRepeatPassword(repeatNewPassword, newPassword)
        },
        isValidName: 'isValidNewPassword'
      },
      { name: 'email', validate: (email: string) => validateEmail(email), isValidName: 'isValidEmail' }
    ]


    const modifiedAttrs = inputsAttrs

    if (input.name === 'repeatNewPassword') {
      const newPassInput = modifiedAttrs.find(input => input.name === 'newPassword')
      const newPassInputIndex = modifiedAttrs.findIndex(input => input.name === 'newPassword')
      const validationNewPass = validationsByInputName.find(input => input.name === 'newPassword')
      if (newPassInputIndex && newPassInput && validationNewPass) {
        modifiedAttrs[newPassInputIndex] = { ...newPassInput, isValid: validationNewPass?.validate(newPassInput.value) || false }
      }
    }
    if (input.name === 'newPassword') {
      const repeatNewPassInput = modifiedAttrs.find(input => input.name === 'repeatNewPassword')
      const repeatNewPassInputIndex = modifiedAttrs.findIndex(input => input.name === 'repeatNewPassword')
      const validationRepeatNewPass = validationsByInputName.find(input => input.name === 'repeatNewPassword')
      if (repeatNewPassInputIndex && repeatNewPassInput && validationRepeatNewPass) {
        modifiedAttrs[repeatNewPassInputIndex] = { ...repeatNewPassInput, isValid: validationRepeatNewPass?.validate(repeatNewPassInput.value) || false }
      }
    }

    const validation = validationsByInputName.find(({ name }) => name === input.name)

    modifiedAttrs[index] = { ...input, value: newValue, isValid: validation?.validate(newValue) || false }

    setInputsAttrs([...modifiedAttrs])

  }

  function areAllFieldsValid(){
    inputsAttrs.forEach((input, index) => {
      validateInput(input.value, input, index)
    })
    return inputsAttrs.every(input => input.isValid)
  }

  function checkValidAndSave(e: React.FormEvent<HTMLFormElement> | React.MouseEvent) {
    e.preventDefault()
    if(areAllFieldsValid()){
      onSave()
    }
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
        {inputsAttrs.map((input, index) => {
          return (
            <div className="flex flex-col pt-5" key={index}>
              <h1 className="body-1 font-semibold">{input.placeholder}</h1>
              <FormField
                type={input.type}
                placeholder={input.placeholder}
                value={input.value}
                icon={input.icon}
                disabled={false}
                warningMessage={input.warningMessage}
                isValid={inputsAttrs[index].isValid}
                onChange={(e) => validateInput((e.target as HTMLTextAreaElement).value, input, index)}
              />
            </div>
          )
        })}
        <div className="pt-10">
          <Button size="regular" color="bg-card" text="Save Changes" onClick={(e) => checkValidAndSave(e)} isLoading={isLoading} disabled={isLoading} />
        </div>
      </form>
    </div>
  )
}


export default InputsCard