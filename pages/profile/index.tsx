import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import IconButton from '../../components/atoms/buttons/IconButton'
const Profile = () => {
  return (
    <div className="relative">
      <div className="flex justify-center items-center h-96 bg-gradient-to-r cursor-pointer from-primary to-button-light rounded-lg hover:opacity-75 transition ease-out">
      </div>
      <div className="absolute cursor-pointer top-16 left-1/2 -ml-32 h-64 w-64 rounded-full shadow-xl hover:scale-105 transition ease-out">
          <Image className="rounded-full" src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg" width={256} height={256} alt="profile-pic" />
          <div className="flex justify-center">
            <IconButton iconName={faPencilAlt} onClick={() => null} iconSize={'icon-small'} />
          </div>
      </div>
  </div>
  )
}

export default Profile