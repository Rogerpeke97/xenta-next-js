
import React, { MouseEventHandler, useEffect, useState } from 'react'
import { faEnvelope, faExclamationCircle, faKey } from '@fortawesome/free-solid-svg-icons'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import FormField from '../../atoms/inputs/FormField'
import TextLink from '../../atoms/links/TextLink'
import { validateEmail, validatePassword } from '../../../utils/validators/inputValidator'
import { useLoginUser } from 'services/user/User'
import IconButton from '@/components/atoms/buttons/IconButton'

const FormLogin = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    isValidEmail: true,
    isValidPassword: true,
    popUpMessage: ''
  })
  const { isLoading, refetch } = useLoginUser({ username: form.email, password: form.password })
  const onInputChange = (newValue: string, inputName: string) => {
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
  const login = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent) => {
    if (areAllFieldsValid()) {
      e.preventDefault()
      await refetch()
    }
  }
  const loginWithGoogle = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent) => {
    e.preventDefault()
    console.log('login with google')
  }

  return (
    <form className="flex flex-col w-full pop-in" onSubmit={login}>
      <div className="px-6 flex flex-col items-center justify-center">
        <FormField isValid={form.isValidEmail} value={form.email} onChange={(e) => onInputChange((e.target as HTMLTextAreaElement).value, 'email')} 
        warningMessage="Please enter a valid email address" type="email" icon={faEnvelope} placeholder="Email" disabled={isLoading} />
        <FormField isValid={form.isValidPassword} value={form.password} onChange={(e) => onInputChange((e.target as HTMLTextAreaElement).value, 'password')} 
        warningMessage="Password must be of at least 8 characters, including digits and one upper case letter" type="password" icon={faKey} placeholder="Password" disabled={isLoading} />
      </div>
      <div className="flex items-end py-6 px-3">
        <div className="flex w-full items-center justify-end">
          <TextLink textColor="text-card" text="Forgot password?" link="/forgot-password" />
        </div>
      </div>
      <div className="flex items-center pt-2 justify-center">
        <IconButton color="bg-card" text="Login" onClick={(e) => login(e)} isLoading={isLoading} disabled={!isValidForm()} />
        <IconButton className="ml-3" color="bg-primary" text="Google login" icon={faGoogle} onClick={(e) => loginWithGoogle(e)} disabled={isLoading} />
      </div>
    </form>
  )
}

export default FormLogin
