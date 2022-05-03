const LeaderBoardTr = ({className, children}: { className?: string, children: React.ReactElement }) => {

  return (
    <tr className={`${className} h-16 my-2 p-2 bg-card rounded-lg flex items-center`}>
      {children}
    </tr>
  )
}



export default LeaderBoardTr