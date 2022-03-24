import type react from 'react'
import AppHelpersWrapper from '../../context/AppHelpers'

export default function DefaultLayout({ children }: { children: Array<react.ReactElement> }) {
  return (
    <AppHelpersWrapper>
      <div className="h-screen smooth-render-long">
        {children}
      </div>
    </AppHelpersWrapper>
  )
}