import { faUser, faKey, faEnvelope, faCogs, faWrench } from '@fortawesome/free-solid-svg-icons'
import Router from 'next/router'
import { useCallback, useEffect, useState } from "react"
import LoadingBar from '@/components/atoms/loaders/LoadingBar'
import InputsCard from "@/components/molecules/forms/InputsCard"
import { UserServicer } from '../../services/user/User'
import TransitionFadeIn from '@/components/molecules/transitions/TransitionFadeIn'


const Settings = () => {

  const [userData, setUserData] = useState({
    name: '',
    username: ''
  })

  const { changePasswordUser, updateEmailUser, getUser } = UserServicer()

  const [accountPasswordInputs, setAccountPasswordInputs] = useState(
    [
      {
        name: 'oldPassword', type: 'password', placeholder: 'Old Password', icon: faKey, value: '',
        isValid: true, warningMessage: 'Please enter a valid password'
      },
      {
        name: 'newPassword', type: 'password', placeholder: 'New Password', icon: faKey, value: '',
        isValid: true, warningMessage: 'New password doesn\'t match or invalid'
      },
      {
        name: 'repeatNewPassword', type: 'password', placeholder: 'Repeat New Password', icon: faKey, value: '',
        isValid: true, warningMessage: 'It must match new password'
      },
    ]
  )

  const [emailInput, setEmailInput] = useState([
    { name: 'email', type: 'email', placeholder: 'Email', icon: faEnvelope, value: '', isValid: true, warningMessage: 'Please enter a valid email' }
  ])

  const [isLoading, setIsLoading] = useState(false)

  const changePassword = async () => {
    setIsLoading(true)
    const params = accountPasswordInputs.reduce((accumulator, input, index) => {
      if (index === 1) {
        return {
          [accumulator.name]: accumulator.value,
          [input.name]: input.value
        }
      }
      return { ...accumulator, [input.name]: input.value }
    })
    const response = await changePasswordUser(params)
    setIsLoading(false)
  }

  const updateEmail = async () => {
    setIsLoading(true)
    const email = emailInput[0].value
    const response = await updateEmailUser(email)
    if (response.error) {
      setIsLoading(false)
      return
    }
    Router.push('/logout')
  }

  async function getUserData() {
    setIsLoading(true)
    const response = await getUser()
    const { name, username } = response.data
    setUserData({ ...userData, name, username })
    setIsLoading(false)
  }

  useEffect(() => {
    getUserData()
    return () => {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <LoadingBar loading={isLoading} />
      <TransitionFadeIn className="p-4">
        <div className="flex items-center pb-8">
          <h1 className="heading-2 font-semibold">Settings</h1>
        </div>
        <InputsCard title={userData.name} subtitle={'Change password'} subtitleIcon={faWrench} titleIcon={faUser} inputsAttrs={accountPasswordInputs}
          setInputsAttrs={(attrs) => setAccountPasswordInputs(attrs)} onSave={changePassword} isLoading={isLoading} />
        <InputsCard title={userData.username} titleIcon={faEnvelope} subtitle={'Change email'} subtitleIcon={faWrench} inputsAttrs={emailInput}
          setInputsAttrs={(attrs) => setEmailInput(attrs)} onSave={updateEmail} isLoading={isLoading} />
      </TransitionFadeIn>
    </>
  )
}

export default Settings