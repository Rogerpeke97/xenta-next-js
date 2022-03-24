import { faRadiation, faBug, faExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext } from "react"
import { AppContextHelpers } from "../../context/AppHelpers"


const InvalidUrl = () => {

  const { windowWidth } = useContext(AppContextHelpers)

  return (
    <div className={`h-full flex w-full ${windowWidth.description === 'small' ? 'flex-col' : 'pt-40'}`}>
      <div className="flex pt-24 xs:pt-0 pb-14 w-full flex-col">
        <div className="flex items-center justify-center">
          <FontAwesomeIcon className="icon text-card" icon={faRadiation} />
          <h1 className="px-4 heading-2 font-bold text-center">
            Invalid url
          </h1>
          <FontAwesomeIcon className="icon text-card" icon={faRadiation} />
        </div>
        <div className="flex items-center justify-center">
          <h3 className="pt-5 subtitle-3 font-semibold">
            The url you are trying to access is not valid.
            <br />
            Please pick a valid menu from the side bar.
          </h3>
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="w-96 p-12 rounded-lg flex flex-col bg-background items-center">
          <div className="flex items-center">
            <h1 className="px-4 heading-1 font-bold text-card text-center">
              404
            </h1>
          </div>
          <div className="flex pt-10 items-center">
            <FontAwesomeIcon className="icon-big text-card" icon={faExclamation} />
          </div>
        </div>
      </div>
    </div>
  )
}


export default InvalidUrl