import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import Header from '@/components/Header/Header'
import { Footer } from '@/components/Footer/Footer'

const LayoutClient = () => {
  const location = useLocation()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (rootRef && rootRef.current) {
      rootRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location])

  return (
    <div className="min-h-screen flex flex-col bg-background" ref={rootRef}>
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer/>
    </div>
  )
}
export default LayoutClient
