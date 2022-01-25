import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faUserTag, faExclamationCircle, faHome, faKey, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import FormField from "../../components/atoms/inputs/FormField"
import { useContext, useEffect, useState } from "react"
import FormWarning from "../../components/atoms/forms/FormWarning"
import Button from "../../components/atoms/buttons/Button"
import { validatePassword, validateRepeatPassword, validateUserName } from "../../plugins/validators/inputValidator"
import { AppContextHelpers } from "../../context/AppContextHelpers"


const Settings = () => {


  const { api, setToast } = useContext(AppContextHelpers)


  const [accountSettings, setAccountSettings] = useState({
    name: '',
    username: '',
    oldPassword: '',
    newPassword: '',
    repeatNewPassword: '',
    isValidOldPassword: true,
    isValidNewPassword: true,
    isValidName: true,
  })

  const [isLoading, setIsLoading] = useState(false)


  function handleInputChange(newValue: string, inputName: string) {

    const validationsByInputName = [
      { name: 'name', validate: (name: string) => validateUserName(name), isValidName: 'isValidName' },
      { name: 'oldPassword', validate: (oldPassword: string) => validatePassword(oldPassword), isValidName: 'isValidOldPassword' },
      {
        name: 'newPassword',
        validate: (newPassword: string) => validateRepeatPassword(newPassword, accountSettings.repeatNewPassword),
        isValidName: 'isValidNewPassword'
      },
      {
        name: 'repeatNewPassword',
        validate: (repeatNewPassword: string) => validateRepeatPassword(repeatNewPassword, accountSettings.newPassword),
        isValidName: 'isValidNewPassword'
      }
    ]

    const validation = validationsByInputName.find(({ name }) => name === inputName)

    const isValidName = validation?.isValidName ?? ''

    setAccountSettings({ ...accountSettings, [inputName]: newValue, [isValidName]: validation?.validate(newValue) })

  }

  function arePasswordsValid() {
    return accountSettings.isValidNewPassword && accountSettings.isValidOldPassword
  }


  async function getUserData(){
    setIsLoading(true)
    const response = await api.get('/user')
    if(response.error){
      setToast({
        messages: [{
          message: response.error,
          type: 'error'
        }],
        displayToast: true
      })
    }
    const { name, username } = response
    setAccountSettings({...accountSettings, name, username})
    setIsLoading(false)
  }

  useEffect(() => {
    getUserData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  async function changePassword(e: React.FormEvent<HTMLFormElement> | React.MouseEvent) {
    e.preventDefault()
    if (!arePasswordsValid()) {
      return
    }
    setIsLoading(true)
    const { username, oldPassword, newPassword } = accountSettings
    const response = await api.post('/change-password', {
      username,
      oldPassword,
      newPassword
    })
    if(response.error){
      setToast({
        messages: [{
          message: response.error,
          type: 'error'
        }],
        displayToast: true
      })
    }
    setIsLoading(false)
    console.log(response)
  }

  return (
    <div className="p-4">
      <div className="flex items-center">
        <h1 className="heading-2 font-semibold">Settings</h1>
      </div>
      <div className="pt-8">
        <div className="flex items-center">
          <FontAwesomeIcon className="icon-small" icon={faUser} color="#0070f3" fixedWidth />
          <h1 className="pl-3 subtitle-2 font-semibold">Account</h1>
        </div>
        <div className="pt-8 pl-7">
          <div className="flex items-center">
            <h1 className="body-1 font-semibold underline">Created at:</h1>
            <h1 className="pl-2 body-1 font-semibold text-card">{'Date'}</h1>
          </div>
          <div className="flex flex-col pt-8">
            <h1 className="body-1 font-semibold">Username</h1>
            <div className="max-w-lg">
              <FormField value={accountSettings.name}
                icon={faUserTag}
                onChange={(e) => handleInputChange((e.target as HTMLTextAreaElement).value, 'name')}
                type="name" placeholder="Username" disabled={isLoading}
              />
              {!accountSettings.isValidName && <FormWarning text="Please enter a valid user name" icon={faExclamationCircle} />}
            </div>
          </div>
        </div>
        <div className="flex pt-12 items-center">
          <FontAwesomeIcon className="icon-small" icon={faUser} color="#0070f3" fixedWidth />
          <h1 className="pl-3 subtitle-2 font-semibold">Change Password</h1>
        </div>
        <div className="pt-8 pl-7">
          <form onSubmit={changePassword}>
            <h1 className="body-1 font-semibold">Old password</h1>
            <div className="max-w-lg">
              <FormField value={accountSettings.oldPassword}
                icon={faKey}
                onChange={(e) => handleInputChange((e.target as HTMLTextAreaElement).value, 'oldPassword')}
                type="password" placeholder="Old Password" disabled={isLoading}
              />
              {!accountSettings.isValidOldPassword && <FormWarning text="Please enter a valid password" icon={faExclamationCircle} />}
            </div>
            <h1 className="body-1 font-semibold">New password</h1>
            <div className="max-w-lg">
              <FormField value={accountSettings.newPassword}
                icon={faKey}
                onChange={(e) => handleInputChange((e.target as HTMLTextAreaElement).value, 'newPassword')}
                type="password" placeholder="New Password" disabled={isLoading}
              />
              {!accountSettings.isValidNewPassword && <FormWarning text="New password doesn't match or invalid" icon={faExclamationCircle} />}
            </div>
            <h1 className="body-1 font-semibold">Repeat new password</h1>
            <div className="max-w-lg">
              <FormField value={accountSettings.repeatNewPassword}
                icon={faKey}
                onChange={(e) => handleInputChange((e.target as HTMLTextAreaElement).value, 'repeatNewPassword')}
                type="password" placeholder="Repeat New Password" disabled={isLoading}
              />
              {!accountSettings.isValidNewPassword && <FormWarning text="It must match new password" icon={faExclamationCircle} />}
            </div>
            <div className="pt-4">
              <Button size="regular" color="bg-card" text="Change Password" onClick={(e) => changePassword(e)} isLoading={isLoading} disabled={!arePasswordsValid()} />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Settings