const Loading = () => {
  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-white/60 backdrop-blur-sm'>
      <div className='w-12 h-12 border-4 border-t-transparent border-primary rounded-full animate-spin'></div>
    </div>
  )
}

export default Loading
