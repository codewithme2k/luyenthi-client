import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setRefreshTokenAction } from '@/redux/slice/accountSlice'

import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { useRouteTitle } from '@/hooks/useRouteTitle'

interface IProps {
  children: React.ReactNode
}

const LayoutApp = (props: IProps) => {
  useRouteTitle()
  const isRefreshToken = useAppSelector((state) => state.account.isRefreshToken)
  const errorRefreshToken = useAppSelector((state) => state.account.errorRefreshToken)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  //handle refresh token error
  useEffect(() => {
    if (isRefreshToken === true) {
      localStorage.removeItem('access_token')
      toast.error(errorRefreshToken)
      dispatch(setRefreshTokenAction({ status: false, message: '' }))
      navigate('/login')
    }
  }, [isRefreshToken])

  return <>{props.children}</>
}

export default LayoutApp
