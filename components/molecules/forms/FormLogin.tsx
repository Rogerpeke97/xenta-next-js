
import React, { MouseEventHandler, useState } from 'react'
import { faEnvelope, faExclamationCircle, faKey } from '@fortawesome/free-solid-svg-icons'
import FormField from '../../atoms/inputs/FormField'
import TextLink from '../../atoms/links/TextLink'
import Button from '../../atoms/buttons/Button'
import FormWarning from '../../atoms/forms/FormWarning'
import Api from '../../../pages/api/Api'



const FormLogin = () => {

  const api = new Api();


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

    const isValidName = validation?.isValidName ?? ''

    setForm({ ...form, [inputName]: newValue, [isValidName]: validation?.validate(newValue) })

  }

  const [isLoading, setIsLoading] = useState(false)


  const login = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent) => {
    e.preventDefault()
    setIsLoading(true)
    console.log('login')
    const response = await api.post('/signin', {params: { email: form.email, password: form.password }})
    console.log(response)
    setTimeout(() => { setIsLoading(false) }, 2000)
  }


  return (
    <form className="flex flex-col w-full pop-in" onSubmit={login}>
      <div className="px-6 flex flex-col items-center justify-center">
        <FormField value={form.email} onChange={(e) => handleChange((e.target as HTMLTextAreaElement).value, 'email')} type="email" icon={faEnvelope} placeholder="Email" />
        <div className="w-full h-7">
          {!form.isValidEmail && <FormWarning text="Please enter a valid email address" icon={faExclamationCircle} />}
        </div>
        <FormField value={form.password} onChange={(e) => handleChange((e.target as HTMLTextAreaElement).value, 'password')} type="password" icon={faKey} placeholder="Password" />
        <div className="w-full h-7">
          {!form.isValidPassword && <FormWarning text="Password must be of at least 8 characters, including digits and one upper case letter" icon={faExclamationCircle} />}
        </div>
      </div>
      <div className="flex items-end pb-6 px-3">
        <div className="flex w-full items-center justify-end">
          <TextLink textColor="text-card" text="Forgot password?" link="/forgot-password" />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Button size="regular" color="bg-card" text="Login" onClick={(e) => login(e)} isLoading={isLoading} />
      </div>
    </form>
  )
}


export default FormLogin