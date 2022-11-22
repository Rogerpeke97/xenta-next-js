import Router, { useRouter } from 'next/router'
import { useEffect, useState, useCallback, useMemo, memo } from 'react'
import { usePingUser } from 'services/user/User'
import { AppHelpers } from '../../context/AppHelpers'
import Login from '../../pages/login'
import Overlay from '../molecules/overlays/Overlay'

const VALID_STATUS_FOR_NON_AUTH = [503, 401]

const AuthGuard = ({ children, isAuthRoute }: { children: React.ReactElement, isAuthRoute: boolean }) => {
  const { isAuthenticated, setIsAuthenticated } = AppHelpers()
  const { isLoading, data, isError, refetch } = usePingUser()
  const router = useRouter()
  const canAccessAuthRoute = !isLoading && !data?.error && !isError && isAuthRoute
  const canAccessNonAuthRoute = !isAuthenticated && VALID_STATUS_FOR_NON_AUTH.includes(data?.status || 0)
  useEffect(() => {
    if(canAccessAuthRoute){
      setIsAuthenticated(true)
    }
  }, [setIsAuthenticated, canAccessAuthRoute, router.pathname])

  useEffect(() => {
    refetch()
  }, [isAuthenticated])
  

  return (
    <>
      <Overlay isLoading={isLoading} />
      {canAccessAuthRoute ? children : 
      <div className="device-height smooth-render-long">
        {canAccessNonAuthRoute && <Login />}
      </div>}
    </>
  )
}

export default AuthGuard
