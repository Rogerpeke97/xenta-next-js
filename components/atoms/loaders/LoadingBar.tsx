


const LoadingBar = ({ loading }: {loading: boolean}) => {




  return(
    <div className={`${!loading && 'shrink-and-fade '} transition ease-out duration-300 h-2 w-full bg-background my-3 rounded-lg`}>
      <div className="progress-bar h-full w-4 bg-stone-300">
      </div>
    </div>
  )
} 

export default LoadingBar