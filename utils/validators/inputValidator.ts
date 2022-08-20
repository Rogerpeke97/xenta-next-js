import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons"

export const INPUT_TYPES = [
  {
    name: 'oldPassword', type: 'password', placeholder: 'Old Password', icon: faKey, value: '',
    isValid: true, warningMessage: 'Please enter a valid password', validate: validatePassword
  },
  {
    name: 'newPassword', type: 'password', placeholder: 'New Password', icon: faKey, value: '',
    isValid: true, warningMessage: 'New password doesn\'t match or invalid', validate: validatePassword
  },
  {
    name: 'repeatNewPassword', type: 'password', placeholder: 'Repeat New Password', icon: faKey, value: '',
    isValid: true, warningMessage: 'It must match new password', validate: () => true
  },
  { 
    name: 'email', type: 'email', placeholder: 'Email', icon: faEnvelope, value: '', isValid: true, 
    warningMessage: 'Please enter a valid email', validate: validateEmail
  }
]

export const passwordInputsReducer = (state: typeof INPUT_TYPES, action: { typeOfInput: string, newValue: string }) => {
  const stateCopy = [...state]
  const foundInput = stateCopy.find(input => input.name === action.typeOfInput)
  const { newValue } = action
  if (foundInput) {
    foundInput.value = newValue
    if(action.typeOfInput === 'repeatNewPassword') {
      const passwordToMatch = stateCopy.find(input => input.name === 'newPassword')?.value
      foundInput.isValid = passwordToMatch === newValue
    }
    else if(action.typeOfInput === 'newPassword') {
      const repeatPassword = stateCopy.find(input => input.name === 'repeatNewPassword')
      if(repeatPassword){
        repeatPassword.isValid = foundInput.value === repeatPassword.value
      }
      foundInput.isValid = foundInput.validate(newValue)
    } else {
      foundInput.isValid = foundInput.validate(newValue)
    }
    return stateCopy
  }
  return state
}

export function validatePassword(password: string){
  return /^(?=.*[A-Z])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/.test(password)
}

export function validateUserName(name: string){
  return /^().{1,15}$/.test(name)
}

export function validateRepeatPassword(password: string, passwordToMatch: string){
  const matches = password === passwordToMatch
  return matches && /^(?=.*[A-Z])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/.test(password)
}

export function validateEmail(email: string) {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)
}
