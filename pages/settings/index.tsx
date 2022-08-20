import { faUser, faKey, faEnvelope, faCogs, faWrench } from '@fortawesome/free-solid-svg-icons'
import Router from 'next/router'
import { useMemo, useReducer, useState } from "react"
import LoadingBar from '@/components/atoms/loaders/LoadingBar'
import InputsCard from "@/components/molecules/forms/InputsCard"
import TransitionFadeIn from '@/components/molecules/transitions/TransitionFadeIn'
import FormField from '@/components/atoms/inputs/FormField'
import { INPUT_TYPES, passwordInputsReducer } from 'utils/validators/inputValidator'
import { ChangePasswordParams, useChangePasswordUser, useGetUser, useUpdateEmailUser } from 'services/user/User'
import { ApiReturnValues } from 'services/api/ApiService'

const Settings = () => {
  const { refetch: setChangedPassword, 
    isRefetching: isUpdatingChangedPassword, data: changedPasswordResult } = useChangePasswordUser()
  const { isLoading: isLoadingUserData, data: user }: {isLoading: boolean, data: ApiReturnValues | undefined} = useGetUser()
  const { refetch: setChangedEmail, isRefetching: isUpdatingChangedEmail, data: changeEmailResult } = useUpdateEmailUser()
  const [passwordInputs, dispatchPasswordInput] = useReducer(passwordInputsReducer, INPUT_TYPES.filter((input) => input.name.toLowerCase().includes('password')))
  const [emailInput, setEmailInput] = useState(INPUT_TYPES.filter((input) => input.name.toLowerCase().includes('email')))
  const changePassword = async () => {
    const params: ChangePasswordParams = {
      "oldPassword": '',
      "newPassword": '',
      "confirmPassword": ''
    }
    passwordInputs.forEach((input) => params[input.name] = input.value)
    await setChangedPassword(params)
    console.log(changedPasswordResult)
  }
  const updateEmail = async () => {
    const email = emailInput[0]?.value
    if(!email) return
    const response = await setChangedEmail(email)
    if (response.error) {
      return
    }
    Router.push('/logout')
  }
  const areAllInputsValid = useMemo(() => {
    return passwordInputs.every((input) => input.isValid && input.value)
  }, [passwordInputs])

  return (
    <>
      <LoadingBar loading={isLoadingUserData} />
      <TransitionFadeIn className="p-4">
        <div className="flex items-center pb-8">
          <h1 className="heading-2 font-semibold">Settings</h1>
        </div>
        <InputsCard title={user?.data?.name} subtitle={'Change password'} subtitleIcon={faWrench} 
          titleIcon={faUser} onSave={changePassword} disabled={!areAllInputsValid} 
          isLoading={isLoadingUserData || isUpdatingChangedPassword}>
          {passwordInputs.map((input, index) => {
            return (
              <div className="flex flex-col pt-5" key={index}>
                <h1 className="body-1 font-semibold">{input.placeholder}</h1>
                <FormField
                  type={input.type}
                  placeholder={input.placeholder}
                  value={input.value}
                  icon={input.icon}
                  disabled={isUpdatingChangedPassword}
                  warningMessage={input.warningMessage}
                  isValid={passwordInputs[index].isValid}
                  onChange={(e) => dispatchPasswordInput({ typeOfInput: input.name, newValue: (e.target as HTMLTextAreaElement).value})}
                />
              </div>
            )
          })}
        </InputsCard>
        <InputsCard title={user?.data?.username} titleIcon={faEnvelope} subtitle={'Change email'} subtitleIcon={faWrench}
         onSave={updateEmail} isLoading={isLoadingUserData || isUpdatingChangedEmail} 
         disabled={!emailInput[0]?.isValid || !emailInput[0]?.value}>
          {emailInput.map((input, index) => {
            return (
              <div className="flex flex-col pt-5" key={index}>
                <h1 className="body-1 font-semibold">{input.placeholder}</h1>
                <FormField
                  type={input.type}
                  placeholder={input.placeholder}
                  value={input.value}
                  icon={input.icon}
                  disabled={isUpdatingChangedEmail}
                  warningMessage={input.warningMessage}
                  isValid={passwordInputs[index].isValid}
                  onChange={(e) => {
                    const newValue = (e.target as HTMLTextAreaElement).value
                    setEmailInput((state) => {
                      return [
                        { ...input, isValid: input.validate(newValue), value: newValue }
                      ]
                    })
                  }}
                />
              </div>
            )
          })}
         </InputsCard>
      </TransitionFadeIn>
    </>
  )
}

export default Settings
