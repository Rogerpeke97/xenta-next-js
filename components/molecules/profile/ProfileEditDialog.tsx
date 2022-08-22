

import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { useCallback, useEffect, useRef, useState } from 'react'
import IconButton from '../../atoms/buttons/IconButton'
import Dialog from '../dialogs/Dialog'

const ProfileEditDialog = () => {

  return (
    <>
      <Dialog onOpen={() => {}} Activator={<IconButton color="bg-primary" className="rounded-full w-[32px]" size="xs" 
        icon={faPencilAlt} onClick={() => {}} />}>
        <div>
          
        </div>
      </Dialog>
    </>
  )
}



export default ProfileEditDialog