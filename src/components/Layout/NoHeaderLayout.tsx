import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'
// Nhớ import RequireAuth theo đúng đường dẫn của bạn
import RequireAuth from '@/components/Layout/RequireAuth'

const NoHeaderLayout = () => {
 const location = useLocation()
 const rootRef = useRef<HTMLDivElement>(null)

 useEffect(() => {
  if (rootRef && rootRef.current) {
   rootRef.current.scrollIntoView({ behavior: 'smooth' })
  }
 }, [location])

 return (
  <div className='min-h-screen flex flex-col bg-background' ref={rootRef}>
   <main className='flex-grow'>
    <RequireAuth />
   </main>
  </div>
 )
}
export default NoHeaderLayout