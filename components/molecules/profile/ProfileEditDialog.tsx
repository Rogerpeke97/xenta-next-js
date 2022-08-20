

import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import IconButton from '../../atoms/buttons/IconButton'
import Dialog from '../dialogs/Dialog'

const ProfileEditDialog = () => {

  return (
    <>
      <Dialog onOpen={() => {}} Activator={<IconButton icon={faPencilAlt} onClick={() => {}} size="sm" />}>
        <div>
          
        </div>
      </Dialog>
    </>
  )
}



export default ProfileEditDialog