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