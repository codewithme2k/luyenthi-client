import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
const LayoutClient = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const location = useLocation()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (rootRef && rootRef.current) {
      rootRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location])

  return (
    <div className='' ref={rootRef}>
      {/* <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}
      {/* <Header /> */}
      <div className=''>
        <Outlet context={[searchTerm, setSearchTerm]} />
      </div>
      {/* <Footer /> */}
    </div>
  )
}
export default LayoutClient
