

import { useCallback, useEffect, useRef, useState } from 'react'
import { UserServicer } from '../../services/user/User'

const LeaderBoardTable = () => {

  return (
    <div className="table">
      <table>
        <tr>
          <th>User</th>
          <th>Rank</th>
          <th>Score</th>
        </tr> 
        <tr>
          <td>User</td>
          <td>Rank</td>
          <td>Score</td>
        </tr>
      </table>
    </div>
  )
}



export default LeaderBoardTable