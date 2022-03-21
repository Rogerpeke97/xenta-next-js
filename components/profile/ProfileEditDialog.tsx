

import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useContext, useEffect, useState } from 'react'
import { AppContextHelpers } from '../../context/AppContextHelpers'
import IconButton from '../atoms/buttons/IconButton'
import Dialog from '../molecules/dialogs/Dialog'



const ProfileEditDialog = () => {

  const [isLoading, setIsLoading] = useState(true)

  const { api, setToast } = useContext(AppContextHelpers)

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
      <Dialog onOpen={() => getUserData()}>
        <div>
          asdasd
        </div>
      </Dialog>
    </>
  )
}



export default ProfileEditDialog