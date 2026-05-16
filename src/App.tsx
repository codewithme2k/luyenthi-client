import { useEffect } from 'react'
import { useAppDispatch } from '@/redux/hooks'
import { fetchAccount } from '@/redux/slice/accountSlice'
import { RouterProvider } from 'react-router'
import routes from '@/routes'

export default function App() {
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (window.location.pathname === '/login' || window.location.pathname === '/register') return
    dispatch(fetchAccount())
  }, [])
  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}
