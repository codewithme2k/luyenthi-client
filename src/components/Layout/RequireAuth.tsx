import React from 'react'
import Loading from '@/components/Layout/Loading'
import { useAppSelector } from '@/redux/hooks'
import { Navigate, Outlet } from 'react-router'

const RequireAuth: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated)
  const isLoading = useAppSelector((state) => state.account.isLoading)

  if (isLoading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  // Render the child routes if authenticated
  return <Outlet />
}

export default RequireAuth
