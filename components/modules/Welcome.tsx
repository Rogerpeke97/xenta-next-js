import type react from 'react'





const Welcome: react.FC<any>= () => {
  const title = 'Xenta'.split('')
  return(
    <div className="px-6 pt-6">
      {title.map((letter, index) => {
        return <h1 key={index} style={{ '--i': index, fontSize: '50px' }} 
        className="animate-text pl-1 heading-1 underline font-bold"
        >
          {letter}
        </h1>
      })}
    </div>
  )
}

export default Welcome