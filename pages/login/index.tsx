import type { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react'
import Button from '../../components/atoms/buttons/Button'
import TextLink from '../../components/atoms/links/TextLink'
import FormLogin from '../../components/molecules/forms/FormLogin'
import FormSignUp from '../../components/molecules/forms/FormSignUp'
import Image from 'next/image'


const loginStyle = {
  minHeight: '600px',
  maxHeight: '800px',
  minWidth: '320px',
  maxWidth: '800px',
  width: '100%'
}

const Login: NextPage = () => {

  const loginStateInfo = {
    state: 'login',
    descriptionText: "Don't have an account?",
    buttonText: 'Sign up',
    stateComponent: <FormLogin />
  }

  const signUpStateInfo = {
    state: 'signup',
    descriptionText: "Already have an account?",
    buttonText: 'Login',
    stateComponent: <FormSignUp onSignUpSuccess={() => setFormState(loginStateInfo)} />
  }

  const findStateToGoTo = (state: string) => {
    return state === 'login' ? signUpStateInfo : loginStateInfo
  }

  const currentStateComponent = () => {
    return formState.stateComponent
  }

  const [formState, setFormState] = useState(loginStateInfo)

  return (
    <div className="flex h-full items-center justify-center">
      <div style={loginStyle} className="flex mdAndUp:h-screen h-full flex-col bg-background rounded-lg">
        <div className="py-4 flex flex-col">
          <div className="flex items-center">
            <Image priority={true} src="/logos/xenta.png" width={50} height={50} alt="profile-pic" />
            <h3 className="subtitle-2 font-bold">Xenta</h3>
          </div>
          <div className="flex pt-4 justify-center">
            <h1 className="heading-3 font-bold">Login</h1>
          </div>
        </div>
        <div className="flex w-full py-3">
          {currentStateComponent()}
        </div>
        <div className="flex w-full h-full items-end pt-4 px-3">
          <div className="flex w-full h-28 items-center justify-start py-4">
            <h1 className="body-1 text-center font-bold pr-3">{formState.descriptionText}</h1>
            <Button size="small" color="bg-card" text={formState.buttonText} onClick={() => setFormState(findStateToGoTo(formState.state))} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
