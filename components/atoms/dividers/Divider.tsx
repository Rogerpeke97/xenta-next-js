import type react from 'react'

interface dividerProps {
  color: string
}


const Divider: react.FC<dividerProps> = ({ color }) => {

  return (
    <div className="flex items-center justify-center">
      <div className="w-4/5 border-b" style={{ color: color }}/>
    </div>
  )
}


export default Divider