

import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import { UserServicer } from '../../services/user/User'
import IconButton from '../atoms/buttons/IconButton'
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
      <Dialog onOpen={getUserData} Activator={<IconButton iconName={faPencilAlt} onClick={getUserData} iconSize={'icon-small'} />}>
        <div>
          
        </div>
      </Dialog>
    </>
  )
}



export default ProfileEditDialog