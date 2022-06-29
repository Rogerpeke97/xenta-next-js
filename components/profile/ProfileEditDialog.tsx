

import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import IconButton from '../atoms/buttons/IconButton'
import Dialog from '../molecules/dialogs/Dialog'

const ProfileEditDialog = () => {

  return (
    <>
      <Dialog onOpen={() => {}} Activator={<IconButton iconName={faPencilAlt} onClick={() => {}} iconSize={'icon-small'} />}>
        <div>
          
        </div>
      </Dialog>
    </>
  )
}



export default ProfileEditDialog