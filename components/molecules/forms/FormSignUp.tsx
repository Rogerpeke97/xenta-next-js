
import React, { MouseEventHandler, useEffect, useState } from 'react'
import { faEnvelope, faExclamationCircle, faKey, faUser } from '@fortawesome/free-solid-svg-icons'
import FormField from '../../atoms/inputs/FormField'
import Button from '../../atoms/buttons/Button'
import FormWarning from '../../atoms/forms/FormWarning'
import { validateEmail, validatePassword, validateUserName } from '../../../plugins/validators/inputValidator'
import { AppHelpers } from '../../../context/AppHelpers'
import { UserServicer } from '../../../services/user/User'


const FormSignUp = ({ onSignUpSuccess }: { onSignUpSuccess: () => void }) => {

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    isValidUser: true,
    isValidEmail: true,
    isValidPassword: true,
    isSubmitted: false,
    popUpMessage: ''
  })

  const { signInUser } = UserServicer()

  const areAllFieldsValid = () => {
    const isValidEmail = validateEmail(form.email)
    const isValidPassword = validatePassword(form.password)
    const isValidUser = validateUserName(form.name)
    setForm({ ...form, isValidEmail, isValidPassword, isValidUser })
    return isValidEmail && isValidPassword && isValidUser
  }

  function handleInputChange(newValue: string, inputName: string) {

    const validationsByInputName = [
      { name: 'email', validate: (email: string) => validateEmail(email), isValidName: 'isValidEmail' },
      { name: 'password', validate: (password: string) => validatePassword(password), isValidName: 'isValidPassword' },
      { name: 'name', validate: (name: string) => validateUserName(name), isValidName: 'isValidUser' }
    ]

    const validation = validationsByInputName.find(({ name }) => name === inputName)

    const isValidName = validation?.isValidName ?? ''

    setForm({ ...form, [inputName]: newValue, [isValidName]: validation?.validate(newValue) })

  }

  const [isLoading, setIsLoading] = useState(false)


  const isValidForm = () => {
    return form.isValidEmail && form.isValidPassword && form.isValidUser
  }


  const signUp = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent) => {
    e.preventDefault()
    if (areAllFieldsValid()) {
      setIsLoading(true)
      console.log('signup')
      const { error, message } = await signInUser({
        username: form.email,
        name: form.name,
        password: form.password
      })
      if (error) {
        setIsLoading(false)
        return
      }
      setIsLoading(false)
      onSignUpSuccess()
    }
  }


  return (
    <form className="flex flex-col w-full pop-in" onSubmit={signUp}>
      <div className="px-6 flex flex-col items-center justify-center">
        <FormField isValid={form.isValidUser} value={form.name} onChange={(e) => handleInputChange((e.target as HTMLTextAreaElement).value, 'name')} 
        warningMessage="Please enter a valid user name" type="name" icon={faUser} placeholder="Name" disabled={isLoading} />
        <FormField isValid={form.isValidEmail} value={form.email} onChange={(e) => handleInputChange((e.target as HTMLTextAreaElement).value, 'email')} 
        warningMessage="Please enter a valid email address" type="email" icon={faEnvelope} placeholder="Email" disabled={isLoading} />
        <FormField isValid={form.isValidPassword} value={form.password} onChange={(e) => handleInputChange((e.target as HTMLTextAreaElement).value, 'password')} 
        warningMessage="Password must be of at least 8 characters, including digits and one upper case letter" type="password" icon={faKey} placeholder="Password" disabled={isLoading} />
      </div>
      <div className="flex items-center pt-10 justify-center">
        <Button size="regular" color="bg-card" text="Sign Up" onClick={(e) => signUp(e)} isLoading={isLoading} disabled={!isValidForm()} />
      </div>
    </form>
  )
}


export default FormSignUp