import type { NextPage } from 'next'
import { useState } from 'react'
import Button from '../../components/atoms/buttons/Button'
import TextLink from '../../components/atoms/links/TextLink'
import FormLogin from '../../components/molecules/forms/FormLogin'
import FormSignUp from '../../components/molecules/forms/FormSignUp'
import Image from 'next/image'
import { firstLetterUppercase } from 'plugins/text/Helpers'
import TransitionFadeIn from '@/components/molecules/transitions/TransitionFadeIn'


const loginStyle = {
  minHeight: '600px',
  maxHeight: '800px',
  minWidth: '320px',
  maxWidth: '800px',
  width: '100%',
  overflowY: 'auto',
  overflowX: 'hidden'
}

const Login: NextPage = () => {

  const loginStateInfo = {
    state: 'Login',
    descriptionText: "Don't have an account?",
    buttonText: 'Sign up',
    stateComponent: <FormLogin />
  }

  const signUpStateInfo = {
    state: 'Sign up',
    descriptionText: "Already have an account?",
    buttonText: 'Login',
    stateComponent: <FormSignUp onSignUpSuccess={() => setFormState(loginStateInfo)} />
  }

  const findStateToGoTo = (state: string) => {
    return state === 'Login' ? signUpStateInfo : loginStateInfo
  }

  const currentStateComponent = () => {
    return formState.stateComponent
  }

  const [formState, setFormState] = useState(loginStateInfo)

  return (
    <div className="flex h-full items-center justify-center bg-no-repeat bg-cover"
      style={{ backgroundImage: "url('/backgrounds/curvedshape.webp')" }}>
      <TransitionFadeIn style={loginStyle} className="flex h-full p-4 flex-col bg-background-2 rounded-3xl">
        <div className="py-4 flex flex-col">
          <div className="flex items-center">
            <Image priority={true} src="/logos/xenta.png" width={50} height={50} alt="profile-pic" />
            <h3 className="subtitle-2 font-bold">Xenta</h3>
          </div>
          <div className="flex pt-4 justify-center">
            <h1 className="heading-3 font-bold">{formState.state}</h1>
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
      </TransitionFadeIn>
    </div>
  )
}

export default Login
