import type react from 'react'
import { useState } from 'react'

interface overlayProps {
  isLoading: boolean,
  loadingText: string,
}



const Loading: react.FC<overlayProps> = ({ isLoading, loadingText}) => {

  const [isVisible, setIsVisible] = useState(true)

  return(
    <div onAnimationEnd={() => setTimeout(() => setIsVisible(false), 1000)}
    className={"h-full w-full flex items-center justify-center rounded-lg z-10 " + (isLoading ? "" : "fade-out ") + (isVisible ? "" : "invisible")}>
      <div className="flex flex-col items-center justify-center">
        <div className="spinner"></div>
        <div className="flex pt-7 items-center justify-center">
          <div>
            {loadingText}
          </div>
        </div>
      </div>
    </div>
  )
}


export default Loading






