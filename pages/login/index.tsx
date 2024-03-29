import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import FormLogin from '../../components/molecules/forms/FormLogin'
import FormSignUp from '../../components/molecules/forms/FormSignUp'
import Image from 'next/image'
import TransitionFadeIn from '@/components/molecules/transitions/TransitionFadeIn'
import { useRouter } from 'next/router'
import IconButton from '@/components/atoms/buttons/IconButton'

const Login: NextPage = () => {

  const router = useRouter()
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
  useEffect(() => {
    if(router.pathname !== '/login'){
      router.replace('/login')
    }
  }, [])

  return (
    <div className="flex h-full items-center justify-center bg-no-repeat bg-cover"
      style={{ backgroundImage: "url('/backgrounds/curvedshape.webp')" }}>
      <TransitionFadeIn className="flex h-full p-4 flex-col bg-background-2 rounded-3xl shadow-md shadow-black
       min-h-[600px] max-h-[800px] min-w-[320px] max-w-[800px] w-full overflow-y-auto overflow-x-hidden">
        <div className="py-4 flex flex-col">
          <div className="flex items-center">
            <Image priority src="/logos/xenta.png" width={50} height={50} alt="profile-pic" />
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
            <IconButton className="text-black" color="bg-button-light" size="sm" 
              onClick={() => setFormState(findStateToGoTo(formState.state))} text={formState.buttonText}  />
          </div>
        </div>
      </TransitionFadeIn>
    </div>
  )
}

export default Login
