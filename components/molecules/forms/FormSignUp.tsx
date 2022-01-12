
import React, { MouseEventHandler, useState } from 'react'
import { faEnvelope, faExclamationCircle, faKey, faUser } from '@fortawesome/free-solid-svg-icons'
import FormField from '../../atoms/inputs/FormField'
import Button from '../../atoms/buttons/Button'
import FormWarning from '../../atoms/forms/FormWarning'



const FormSignUp = () => {

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


  const validateEmail = (email: string) => {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)
  }

  const validatePassword = (password: string) => {
    return /^(?=.*[A-Z])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/.test(password)
  }

  const validateUserName = (name: string) => {
    return /^().{1,15}$/.test(name)
  }

  const areAllFieldsValid = () => {
    const isValidEmail = validateEmail(form.email)
    const isValidPassword = validatePassword(form.password)
    const isValidUser = validateUserName(form.name)
    setForm({ ...form, isValidEmail, isValidPassword, isValidUser })
    return isValidEmail && isValidPassword && isValidUser
  }

  function handleChange(newValue: string, inputName: string) {

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


  const signUp = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent) => {
    e.preventDefault()
    if (areAllFieldsValid()) {
      setIsLoading(true)
      console.log('signup')
      setTimeout(() => { setIsLoading(false) }, 2000)
    }
  }


  return (
    <form className="flex flex-col w-full overflow-scroll pop-in" onSubmit={signUp}>
      <div className="px-6 flex flex-col items-center justify-center">
        <FormField value={form.name} onChange={(e) => handleChange((e.target as HTMLTextAreaElement).value, 'name')} type="name" icon={faUser} placeholder="Name" />
        <div className="w-full h-7">
          {!form.isValidUser && <FormWarning text="Please enter a valid user name" icon={faExclamationCircle} />}
        </div>
        <FormField value={form.email} onChange={(e) => handleChange((e.target as HTMLTextAreaElement).value, 'email')} type="email" icon={faEnvelope} placeholder="Email" />
        <div className="w-full h-7">
          {!form.isValidEmail && <FormWarning text="Please enter a valid email address" icon={faExclamationCircle} />}
        </div>
        <FormField value={form.password} onChange={(e) => handleChange((e.target as HTMLTextAreaElement).value, 'password')} type="password" icon={faKey} placeholder="Password" />
        <div className="w-full h-7">
          {!form.isValidPassword && <FormWarning text="Password must be of at least 8 characters, including digits and one upper case letter" icon={faExclamationCircle} />}
        </div>
      </div>
      <div className="flex items-center pt-7 justify-center">
        <Button size="regular" color="bg-card" text="Sign Up" onClick={(e) => signUp(e)} isLoading={isLoading} disabled={!isValidForm()} />
      </div>
    </form>
  )
}


export default FormSignUp