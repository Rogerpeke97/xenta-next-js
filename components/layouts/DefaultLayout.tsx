import type react from 'react'

export default function DefaultLayout({ children }: { children: Array<react.ReactElement> }) {
  return (
    <div className="h-screen smooth-render-long">
      {children}
    </div>
  )
}