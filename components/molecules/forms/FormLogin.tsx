
import { useState } from 'react'
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons'
import FormField from '../../atoms/inputs/FormField'
import TextLink from '../../atoms/links/TextLink'
import Button from '../../atoms/buttons/Button'



const FormLogin = () => {

  const [isLoading, setIsLoading] = useState(false)

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const login = () => {
    console.log('login')
  }



  return (
    <form className="flex flex-col w-full" onSubmit={login}>
      <div className="px-6 flex flex-col items-center justify-center">
        <FormField value={email} onChange={(e) => setEmail((e.target as HTMLTextAreaElement).value)} type="email" icon={faEnvelope} placeholder="Email" />
        <FormField value={password} onChange={(e) => setPassword((e.target as HTMLTextAreaElement).value)} type="password" icon={faKey} placeholder="Password" />
      </div>
      <div className="flex items-end pb-6 px-3">
        <div className="flex w-full items-center justify-end">
          <TextLink text="Forgot password?" link="/forgot-password" />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Button color="bg-card" text="Login" onClick={login} isLoading={isLoading} />
      </div>
    </form>
  )
}


export default FormLogin