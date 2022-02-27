import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faUserTag, faExclamationCircle, faHome, faKey, faSignOutAlt, faTag, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import FormField from "../../components/atoms/inputs/FormField"
import { useContext, useEffect, useState } from "react"
import FormWarning from "../../components/atoms/forms/FormWarning"
import Button from "../../components/atoms/buttons/Button"
import { validatePassword, validateRepeatPassword, validateUserName } from "../../plugins/validators/inputValidator"
import { AppContextHelpers } from "../../context/AppContextHelpers"
import InputsCard from "../../components/molecules/forms/InputsCard"


const Settings = () => {


  const { api, setToast } = useContext(AppContextHelpers)

  const [userData, setUserData] = useState({
    name: '',
    username: ''
  })


  const [accountInputs, setAccountInputs] = useState(
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


  async function getUserData() {
    setIsLoading(true)
    const response = await api.get('/api/user')
    if (response.error) {
      setToast({
        messages: [{
          message: response.error,
          type: 'error'
        }],
        displayToast: true
      })
    }
    const { name, username, email } = response.data
    setUserData({ ...userData, name, username, email })
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
      <InputsCard title={'Account'} subtitle={userData.name} subtitleIcon={faTag} titleIcon={faUser} inputsAttrs={accountInputs} 
      setInputsAttrs={(attrs) => setAccountInputs(attrs)} onSave={() => null} isLoading={isLoading} />
      <InputsCard subtitle={userData.username} subtitleIcon={faEnvelope} inputsAttrs={emailInput} 
      setInputsAttrs={(attrs) => setEmailInput(attrs)} onSave={() => null} isLoading={isLoading} />
    </div>
  )
}

export default Settings