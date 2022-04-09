import type react from 'react'
import { useState } from 'react'

interface overlayProps {
  isLoading: boolean,
  loadingText: string,
}



const Loading: react.FC<overlayProps> = ({ isLoading, loadingText}) => {

  return(
    <div
    className={"h-full w-full flex items-center justify-center rounded-lg z-10 "}>
      <div className="flex flex-col items-center justify-center">
        <div className="spinner"></div>
        <div className="flex pt-7 items-center justify-center">
          <h3 className="subtitle-1">
            {loadingText}
          </h3>
        </div>
      </div>
    </div>
  )
}


export default Loading






