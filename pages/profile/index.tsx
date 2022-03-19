import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faCrown, faEgg, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import IconButton from '../../components/atoms/buttons/IconButton'
import Stat from '../../components/profile/Stat'
import { AppContextHelpers } from '../../context/AppContextHelpers'

interface Stat {
  stat: string
  value: number
  icon: IconProp
}
const Profile = () => {
  const { api, setToast } = useContext(AppContextHelpers)

  const [isLoading, setIsLoading] = useState(true)

  const [stats, setStats] = useState<Array<Stat> | null>([])

  async function getUserData() {
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
    setStats([
      { stat: 'Score', value: score, icon: faCrown },
      { stat: 'Created', value: created_at, icon: faEgg },
      { stat: 'Updated', value: updated_at, icon: faPencilAlt }
    ])
    setIsLoading(false)
  }

  useEffect(() => {
    getUserData()
  }, [])
  return (
    <>
      <div className="relative">
        <div className="flex opacity-75 justify-center items-center h-80 bg-primary cursor-pointer rounded-lg hover:opacity-100 transition ease-out">
        </div>
        <div className="relative cursor-pointer -top-32 left-1/2 -ml-32 h-64 w-64 rounded-full shadow-xl hover:scale-105 transition ease-out">
          <Image className="rounded-full" src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg" width={256} height={256} alt="profile-pic" />
          <div className="flex justify-center items-center">
            <h3 className="heading-3 font-bold mr-3">
              Name
            </h3>
            <IconButton iconName={faPencilAlt} onClick={() => null} iconSize={'icon-small'} />
          </div>
        </div>
      </div>
      <div className="flex mdAndDown:px-5 px-48 justify-between items-center">
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