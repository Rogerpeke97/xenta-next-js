import type react from 'react'

interface dividerProps {
  color: string,
  className?: string
}


const Divider: react.FC<dividerProps> = ({ color, className }) => {

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-4/5 border-b" style={{ color: color }}/>
    </div>
  )
}


export default Divider