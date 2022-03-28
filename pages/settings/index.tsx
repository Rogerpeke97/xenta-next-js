import { faUser, faUserTag, faExclamationCircle, faHome, faKey, faSignOutAlt, faTag, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useState } from "react"
import InputsCard from "../../components/molecules/forms/InputsCard"
import { UserServicer } from '../../services/user/User'


const Settings = () => {

  const [userData, setUserData] = useState({
    name: '',
    username: ''
  })

  const { changePasswordUser, getUser } = UserServicer()

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

  const changePassword = useCallback(async () => {
    setIsLoading(true)
    console.log(accountPasswordInputs)
    const params = accountPasswordInputs.reduce((accumulator, input, index) => {
      console.log(index, accumulator)
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
  }, [accountPasswordInputs])

  const updateEmail = useCallback(async () => {
    // Commented until I have the api call
    // const response = await api.put('/api/update-email', { email: emailInput[0].value })
    // setIsLoading(false)
    // console.log(response)
  }, [])

  async function getUserData() {
    setIsLoading(true)
    const response = await getUser()
    const { name, username } = response.data
    setUserData({ ...userData, name, username })
    setIsLoading(false)
  }

  useEffect(() => {
    getUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="p-4 pb-20">
      <div className="flex items-center pb-8">
        <h1 className="heading-2 font-semibold">Settings</h1>
      </div>
      <InputsCard title={'Account'} subtitle={userData.name} subtitleIcon={faTag} titleIcon={faUser} inputsAttrs={accountPasswordInputs}
        setInputsAttrs={(attrs) => setAccountPasswordInputs(attrs)} onSave={changePassword} isLoading={isLoading} />
      <InputsCard subtitle={userData.username} subtitleIcon={faEnvelope} inputsAttrs={emailInput}
        setInputsAttrs={(attrs) => setEmailInput(attrs)} onSave={updateEmail} isLoading={isLoading} />
    </div>
  )
}

export default Settings