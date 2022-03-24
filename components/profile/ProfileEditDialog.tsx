

import { useCallback, useState } from 'react'
import { AppHelpers } from '../../context/AppHelpers'
import Dialog from '../molecules/dialogs/Dialog'



const ProfileEditDialog = () => {

  const [isLoading, setIsLoading] = useState(true)

  const { api, setToast } = AppHelpers()

  const getUserData = useCallback(async() => {
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
    const { score, updated_at, created_at } = response.data
    setIsLoading(false)
  }, [])


  return (
    <>
      <Dialog onOpen={getUserData}>
        <div>
          asdasd
        </div>
      </Dialog>
    </>
  )
}



export default ProfileEditDialog