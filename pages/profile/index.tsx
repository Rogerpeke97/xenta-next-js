import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faCrown, faEgg, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import LoadingBar from '../../components/atoms/loaders/LoadingBar'
import ProfileEditDialog from '../../components/profile/ProfileEditDialog'
import Stat, { StatType } from '../../components/profile/Stat'
import { formatDate } from '../../plugins/time/time'
import { UserServicer } from '../../services/user/User'
import { UserType } from '../../types/user'

const Profile = () => {

  const { getUser } = UserServicer()

  const [isLoading, setIsLoading] = useState(true)

  const [user, setUser] = useState<UserType>()

  const [stats, setStats] = useState<Array<StatType> | null>([])

  async function getUserData() {
    setIsLoading(true)
    const response = await getUser()
    const userData: UserType = response.data
    const { score, updated_at, created_at } = userData
    setUser(userData)
    setStats([
      { stat: 'Score', value: score, icon: faCrown },
      { stat: 'Created', value: formatDate(created_at), icon: faEgg },
      { stat: 'Updated', value: formatDate(updated_at), icon: faPencilAlt }
    ])
    setIsLoading(false)
  }

  useEffect(() => {
    getUserData()
  }, [])
  
  return (
    <>
    <LoadingBar loading={isLoading} />
      <div className="flex flex-col pb-20 items-center justify-center rounded-full shadow-xl transition ease-out">
        <Image className="rounded-full cursor-pointer" src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg" width={256} height={256} alt="profile-pic" />
        <div className="flex justify-center items-center">
          <h3 className="heading-3 font-bold mr-3">
            {user?.name}
          </h3>
          <ProfileEditDialog />
        </div>
      </div>
      <div className="flex mdAndDown:px-0 px-48 pb-12 justify-between items-center">
        {stats && stats.map(({ stat, value, icon }, index) => {
          return (
            <Stat stat={stat} value={value} icon={icon} key={index} />
          )
        })}
      </div>
    </>
  )
}

export default Profile