
import React, { MouseEventHandler, useContext, useState } from 'react'
import { faEnvelope, faExclamationCircle, faKey } from '@fortawesome/free-solid-svg-icons'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import FormField from '../../atoms/inputs/FormField'
import TextLink from '../../atoms/links/TextLink'
import Button from '../../atoms/buttons/Button'
import FormWarning from '../../atoms/forms/FormWarning'
import Api from '../../../pages/api/Api'
import Toast from '../../atoms/notifications/Toast'
import { AppContextHelpers } from '../../../context/AppContextHelpers'

interface message {
  message: string,
  type: string
}



const FormLogin = () => {

  const { api, setToast } = useContext(AppContextHelpers)

  const [form, setForm] = useState({
    email: '',
    password: '',
    isValidEmail: true,
    isValidPassword: true,
    isSubmitted: false,
    popUpMessage: ''
  })


  const validateEmail = (email: string) => {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)
  }

  const validatePassword = (password: string) => {
    return /^(?=.*[A-Z])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/.test(password)
  }

  function handleChange(newValue: string, inputName: string) {

    const validationsByInputName = [
      { name: 'email', validate: (email: string) => validateEmail(email), isValidName: 'isValidEmail' },
      { name: 'password', validate: (password: string) => validatePassword(password), isValidName: 'isValidPassword' }
    ]

    const validation = validationsByInputName.find(({ name }) => name === inputName)

    console.log(validation?.validate(newValue))

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
    console.log(areAllFieldsValid())
    if (areAllFieldsValid()) {
      e.preventDefault()
      setIsLoading(true)
      console.log('login')
      const { error, message } = await api.post('/signin', { email: form.email, password: form.password })
      if (error) {
        console.log(error)
        setToast({
          messages: [{
            message: error,
            type: 'error'
          }],
          displayToast: true
        })
      }
      else {
        console.log(error)
        setToast({
          messages: [{
            message: message,
            type: 'success'
          }],
          displayToast: true
        })
      }
      setTimeout(() => { setIsLoading(false) }, 2000)
    }
  }

  const loginWithGoogle = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent) => {
    e.preventDefault()
    console.log('login with google')
  }


  return (
    <form className="flex flex-col w-full pop-in" onSubmit={login}>
      <div className="px-6 flex flex-col items-center justify-center">
        <FormField value={form.email} onChange={(e) => handleChange((e.target as HTMLTextAreaElement).value, 'email')} type="email" icon={faEnvelope} placeholder="Email" disabled={isLoading} />
        <div className="w-full h-7">
          {!form.isValidEmail && <FormWarning text="Please enter a valid email address" icon={faExclamationCircle} />}
        </div>
        <FormField value={form.password} onChange={(e) => handleChange((e.target as HTMLTextAreaElement).value, 'password')} type="password" icon={faKey} placeholder="Password" disabled={isLoading} />
        <div className="w-full h-7">
          {!form.isValidPassword && <FormWarning text="Password must be of at least 8 characters, including digits and one upper case letter" icon={faExclamationCircle} />}
        </div>
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