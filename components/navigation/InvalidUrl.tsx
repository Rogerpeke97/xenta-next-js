import { faRadiation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


const invalidUrl = () => {

  return (
    <div className="h-screen pt-16 flex justify-center w-full">
      <div className="flex flex-col">
        <div className="flex items-center justify-center">
          <FontAwesomeIcon className="icon text-card" icon={faRadiation} />
          <h1 className="px-4 heading-2 font-bold text-center">
            Invalid url
          </h1>
          <FontAwesomeIcon className="icon text-card" icon={faRadiation} />
        </div>
        <h3 className="pt-5 subtitle-3 font-semibold">
          The url you are trying to access is not valid.
          <br />
          Please pick a valid menu from the side bar.
        </h3>
      </div>
    </div>
  )
}


export default invalidUrl