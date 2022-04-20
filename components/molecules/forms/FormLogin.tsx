
import React, { MouseEventHandler, useEffect, useState } from 'react'
import { faEnvelope, faExclamationCircle, faKey } from '@fortawesome/free-solid-svg-icons'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import FormField from '../../atoms/inputs/FormField'
import TextLink from '../../atoms/links/TextLink'
import Button from '../../atoms/buttons/Button'
import FormWarning from '../../atoms/forms/FormWarning'
import { AppHelpers } from '../../../context/AppHelpers'
import Router from 'next/router'
import { validateEmail, validatePassword } from '../../../plugins/validators/inputValidator'
import { UserServicer } from '../../../services/user/User'



const FormLogin = () => {

  const { setIsAuthenticated } = AppHelpers()

  const { loginUser } = UserServicer()

  const [form, setForm] = useState({
    email: '',
    password: '',
    isValidEmail: true,
    isValidPassword: true,
    isSubmitted: false,
    popUpMessage: ''
  })

  function handleInputChange(newValue: string, inputName: string) {

    const validationsByInputName = [
      { name: 'email', validate: (email: string) => validateEmail(email), isValidName: 'isValidEmail' },
      { name: 'password', validate: (password: string) => validatePassword(password), isValidName: 'isValidPassword' }
    ]

    const validation = validationsByInputName.find(({ name }) => name === inputName)

    const isValidName = validation?.isValidName ?? ''

    setForm({ ...form, [inputName]: newValue, [isValidName]: validation?.validate(newValue) })

  }

  const isValidForm = () => {
    return form.isValidEmail && form.isValidPassword
  }

  const areAllFieldsValid = () => {
    const isValidEmail = validateEmail(form.email)
    const isValidPassword = validatePassword(form.password)
    setForm({ ...form, isValidEmail, isValidPassword })
    return isValidEmail && isValidPassword
  }

  const [isLoading, setIsLoading] = useState(false)

  const login = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent) => {
    if (areAllFieldsValid()) {
      e.preventDefault()
      setIsLoading(true)
      await loginUser({ username: form.email, password: form.password })
      setIsLoading(false)
    }
  }

  const loginWithGoogle = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent) => {
    e.preventDefault()
    console.log('login with google')
  }

  useEffect(() => {
    return () => {
      setIsLoading(false)
    }
  },[])


  return (
    <form className="flex flex-col w-full pop-in" onSubmit={login}>
      <div className="px-6 flex flex-col items-center justify-center">
        <FormField isValid={form.isValidEmail} value={form.email} onChange={(e) => handleInputChange((e.target as HTMLTextAreaElement).value, 'email')} 
        warningMessage="Please enter a valid email address" type="email" icon={faEnvelope} placeholder="Email" disabled={isLoading} />
        <FormField isValid={form.isValidPassword} value={form.password} onChange={(e) => handleInputChange((e.target as HTMLTextAreaElement).value, 'password')} 
        warningMessage="Password must be of at least 8 characters, including digits and one upper case letter" type="password" icon={faKey} placeholder="Password" disabled={isLoading} />
      </div>
      <div className="flex items-end py-6 px-3">
        <div className="flex w-full items-center justify-end">
          <TextLink textColor="text-card" text="Forgot password?" link="/forgot-password" />
        </div>
      </div>
      <div className="flex items-center pt-2 justify-center">
        <Button size="regular" color="bg-card" text="Login" onClick={(e) => login(e)} isLoading={isLoading} disabled={!isValidForm()} />
        <div className="ml-3">
          <Button size="regular" color="bg-primary" text="Google login" icon={faGoogle} onClick={(e) => loginWithGoogle(e)} disabled={isLoading} />
        </div>
      </div>
    </form>
  )
}


export default FormLogin