import type react from 'react'

interface NavProps {
  name: string
}

const NavigationBar: react.FC<NavProps> = ({ name }) => {
  return (
		<nav className="flex h-24 w-full">
			<div className="h-full flex grow content-center">
				<div className="pl-4 flex justify-center items-center">
          {name}
				</div>
			</div>
      <div>

      </div>
		</nav>
  )
}


export default NavigationBar