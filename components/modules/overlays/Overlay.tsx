import type react from 'react'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'


interface overlayProps {
  isLoading: boolean
}



const Overlay: react.FC<overlayProps> = ({ isLoading }) => {

  const loadingStates = [
    {text: 'Loading...'.split(''), value: true},
    {text: 'Done!'.split(''), value: false}
  ]

  const findLoadingState = () => {
    return loadingStates.find(state => state.value === isLoading) ?? {text: [], value: false}
  }

  return(
    <div className={"h-full w-full flex items-center justify-center absolute bg-card rounded-lg z-10 " + (isLoading ? "" : "fade-out")}>
      <div className="flex flex-col items-center justify-center">
        {isLoading ? <div className="spinner"></div> : <FontAwesomeIcon className="icon smooth-render" icon={faCheck} />}
        <div className="flex pt-7 items-center justify-center">
          <div>
            {findLoadingState().text.map((letter, index) => {
              return <h1 key={index} style={{ '--i': index}} 
              className="animate-text pl-1 heading-3"
              >
                {letter}
              </h1>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}


export default Overlay






