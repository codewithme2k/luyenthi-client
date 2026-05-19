import { createPortal } from 'react-dom'

const Loading = () => {
  return createPortal(
    <div className='fixed inset-0 flex flex-col items-center justify-center z-[9999] bg-background/50 backdrop-blur-md transition-all duration-300'>
      <div className='relative flex items-center justify-center'>
        {/* Outer spinning ring */}
        <div className='w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin'></div>
        {/* Inner reverse-spinning ring */}
        <div className='absolute w-10 h-10 border-4 border-muted border-b-primary rounded-full animate-spin [animation-direction:reverse] [animation-duration:1s]'></div>
      </div>
      <span className='mt-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground animate-pulse'>
        Loading...
      </span>
    </div>,
    document.body
  )
}

export default Loading
