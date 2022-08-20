

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { UserServicer } from '../../../services/user/User'
import LeaderBoardTr from './LeaderBoardTr'

const LeaderBoardTable = ({className}: { className: string }) => {

  return (
    <table className={`table-leaderboard min-w-[290px] max-w-96 w-full rounded-lg ${className}`}>
      <tbody>
        <LeaderBoardTr className="">
          <td className="flex">
            <div className="flex items-center">
              <Image className="rounded-full" src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg" width={32} height={32} alt="profile-pic" />
            </div>
            <div>
              <h3 className="body-1 font-bold ml-3">Name</h3>
              <h3 className="body-1 font-bold text-slate-600 ml-3">hehe</h3>
            </div>
          </td>
        </LeaderBoardTr>
        <LeaderBoardTr>
          <td className="flex">
            <div>
              <Image className="rounded-full" src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg" width={32} height={32} alt="profile-pic" />
            </div>
          </td>
        </LeaderBoardTr>
      </tbody>
    </table>
  )
}



export default LeaderBoardTable