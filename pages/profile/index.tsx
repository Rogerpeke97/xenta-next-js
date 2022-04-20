import ProgressBar from '@/components/atoms/loaders/ProgressBar'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faCertificate, faCrown, faEgg, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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

  const [stats, setStats] = useState({
    max_score: 150,
    points: 3000,
    games_played: 10,
    plays: [
      { date: '2020-01-01', score: 100 },
      { date: '2020-01-02', score: 200 },
      { date: '2020-01-03', score: 300 },
    ]
  })

  async function getUserData() {
    setIsLoading(true)
    const response = await getUser()
    const userData: UserType = response.data
    const { score, updated_at, created_at } = userData
    setUser(userData)
    // setStats([
    //   { stat: 'Score', value: score, icon: faCrown },
    //   { stat: 'Created', value: formatDate(created_at), icon: faEgg },
    //   { stat: 'Updated', value: formatDate(updated_at), icon: faPencilAlt }
    // ])
    setIsLoading(false)
  }

  useEffect(() => {
    getUserData()
  }, [])
  
  return (
    <>
      <LoadingBar loading={isLoading} />
      <h3 className="subtitle-1 font-bold">Overview</h3>
      <div className="flex flex-wrap pt-6">
        <div className="flex m-2 grow relative justify-center flex-col rounded-full transition ease-out">
          <div className="flex justify-center">
            <Image className="rounded-full cursor-pointer" src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg" width={256} height={256} alt="profile-pic" />
          </div>
          <div className="flex justify-center items-center">
            <h3 className="heading-3 font-bold mr-3">
              {user?.name}
            </h3>
            <ProfileEditDialog />
          </div>
        </div>
        <div className="m-2 justify-center flex grow h-64">
          <div className="w-full max-w-[600px] min-w-[300px] p-5 rounded-lg bg-hoverCard">
            <h3 className="subtitle-3 font-bold">Your score</h3>
            <div className="flex py-1">
              <FontAwesomeIcon className="icon-x-large mr-4" color="yellow" icon={faCrown} />
              <h3 className="pt-2 heading-3 font-bold pl-2">{stats?.max_score}</h3>
            </div>
            <h3 className="subtitle-3">Recent plays</h3>
            {stats?.plays.map((play, index) => (
              <div key={index} className="flex pt-2 justify-between">
                <h3 className="subtitle-3 font-bold">{ `Played at "${play.date}"` }</h3>
                <div className="flex items-center">
                  <FontAwesomeIcon className="icon-small mr-1" color="grey" icon={faCrown} />
                  <h3 className="body-2">{ play.score }</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="m-2 flex justify-center h-64 grow">
          <div className="min-w-[300px] max-w-[300px] w-full p-5 rounded-lg bg-hoverCard">
            <h3 className="subtitle-3 font-bold">My level</h3>
            <div className="flex items-center justify-center">
              <div className="flex rotate-45 w-24 justify-center cursor-default truncate backface-hidden rounded-lg box-hover hover:scale-105 items-center bg-primary mt-7 h-24 py-1">
                <h3 className="heading-3 w-full truncate -rotate-45 font-bold text-center">123</h3>
              </div>
            </div>
            <ProgressBar measurementUnit="XP" className="mt-8" progress={120} totalProgress={1000} titleForAmountLeftFor="next level" />
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="m-2 flex justify-center h-64 grow">
          <div className="min-w-[300px] max-w-[300px] w-full p-5 rounded-lg bg-hoverCard">
            <h3 className="subtitle-3 font-bold text-center">Your rank</h3>
            <div className="flex py-14 justify-center">
              <FontAwesomeIcon className="icon-x-large mr-4" color="silver" icon={faCertificate} />
              <h3 className="pt-2 truncate heading-3 font-bold pl-2">{stats?.max_score}<span className="subtitle-2">th</span></h3>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile