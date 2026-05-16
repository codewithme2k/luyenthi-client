'use client'

import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

const NotPermitted = () => {
  const navigate = useNavigate()

  return (
    <div className='flex h-[80vh] flex-col items-center justify-center text-center px-4'>
      <div className='flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-500 mb-4'>
        <AlertTriangle className='w-8 h-8' />
      </div>
      <h1 className='text-4xl font-bold mb-2'>403</h1>
      <p className='text-lg text-muted-foreground mb-6'>Sorry, you are not authorized to access this page.</p>
      <Button onClick={() => navigate('/')}>Back Home</Button>
    </div>
  )
}

export default NotPermitted
