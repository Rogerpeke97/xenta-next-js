import ProgressBar from '@/components/atoms/loaders/ProgressBar'
import TransitionFadeIn from '@/components/molecules/transitions/TransitionFadeIn'
import LeaderBoardTable from '@/components/molecules/profile/LeaderBoardTable'
import { faCertificate, faCrown, faEgg, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useGetUser } from 'services/user/User'
import LoadingBar from '../../components/atoms/loaders/LoadingBar'
import ProfileEditDialog from '../../components/molecules/profile/ProfileEditDialog'
import { ApiReturnValues } from 'services/api/ApiService'

const Profile = () => {
  const { isLoading, data: user }: {isLoading: boolean, data: ApiReturnValues | undefined} = useGetUser()
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

  return (
    <>
      <LoadingBar loading={isLoading} />
      <h3 className="subtitle-1 font-bold">Overview</h3>
      <TransitionFadeIn className="flex flex-wrap pt-6">
        <div className="flex m-2 grow justify-center flex-col rounded-full transition ease-out">
          <div className="flex justify-center">
            <Image className="rounded-full cursor-pointer" src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg" width={256} height={256} alt="profile-pic" />
          </div>
          <div className="flex justify-center items-center">
            <h3 className="heading-3 font-bold mr-3">
              {user?.data?.name}
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
                <h3 className="subtitle-3 font-bold">{`Played at "${play.date}"`}</h3>
                <div className="flex items-center">
                  <FontAwesomeIcon className="icon-small mr-1" color="grey" icon={faCrown} />
                  <h3 className="body-2">{play.score}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="m-2 flex justify-center h-64 grow">
          <div className="min-w-[300px] max-w-[300px] w-full p-5 rounded-lg bg-hoverCard">
            <h3 className="subtitle-3 font-bold">My level</h3>
            <div className="flex items-center justify-center">
              <div className="mt-7 py-1 rombo-box box-hover">
                <h3 className="heading-3 w-full truncate -rotate-45 font-bold text-center">123</h3>
              </div>
            </div>
            <ProgressBar measurementUnit="XP" className="mt-8" progress={120} totalProgress={1000} titleForAmountLeftFor="next level" />
          </div>
        </div>
      </TransitionFadeIn>
      <TransitionFadeIn className="flex flex-wrap" delayMs={500}>
        <div className="m-2 flex justify-center pt-6 h-64 grow">
          <div className="min-w-[300px] max-w-[300px] w-full p-5 rounded-lg bg-hoverCard">
            <h3 className="subtitle-3 font-bold text-center">Your rank</h3>
            <div className="flex pt-9 pb-6 justify-center">
              <FontAwesomeIcon className="icon-x-large mr-4" color="silver" icon={faCertificate} />
              <h3 className="pt-2 truncate heading-3 font-bold pl-2">{stats?.max_score}<span className="subtitle-2">th</span></h3>
            </div>
            <div>
              <h3 className="body-2 text-center font-bold">out of 3000</h3>
            </div>
          </div>
        </div>
        <div className="flex pt-6 grow justify-center">
          <div className="bg-hoverCard p-5 rounded-lg">
            <h3 className="subtitle-3 font-bold">Leaderboard</h3>
            <LeaderBoardTable className="mt-4" />
          </div>
        </div>
      </TransitionFadeIn>
    </>
  )
}

export default Profile