import Loading from '@/components/Layout/Loading'
import NotPermitted from '@/components/Layout/protectedRoute/not-permitted'
import { useAppSelector } from '@/redux/hooks'

import { Navigate } from 'react-router'

const RoleBaseRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAppSelector((state) => state.account.user)
  const userRole = user.role

  if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
    return <>{children}</>
  } else {
    return <NotPermitted />
  }
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated)
  const isLoading = useAppSelector((state) => state.account.isLoading)
  return (
    <>
      {isLoading === true ? (
        <Loading />
      ) : (
        <>
          {isAuthenticated === true ? (
            <>
              <RoleBaseRoute>{children}</RoleBaseRoute>
            </>
          ) : (
            <Navigate to='/login' replace />
          )}
        </>
      )}
    </>
  )
}

export default ProtectedRoute
