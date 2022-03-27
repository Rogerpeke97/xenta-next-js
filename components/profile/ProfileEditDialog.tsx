

import { useCallback, useState } from 'react'
import { ApiServicer } from '../../context/ApiService'
import { AppHelpers } from '../../context/AppHelpers'
import { UserServicer } from '../../services/user/User'
import Dialog from '../molecules/dialogs/Dialog'



const ProfileEditDialog = () => {

  const [isLoading, setIsLoading] = useState(true)

  const { getUser } = UserServicer()

  const getUserData = useCallback(async() => {
    setIsLoading(true)
    const response = await getUser()
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