import { useRouteError } from 'react-router'

export default function NotFound() {
  const error: any = useRouteError()
  
  console.error("Router Error Caught:", error)

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-red-500 mb-4">Oops! Đã xảy ra lỗi</h1>
      {error ? (
        <div className="bg-red-50 text-red-800 p-4 rounded-xl inline-block text-left shadow-sm">
          <p className="font-semibold">{error.status} {error.statusText}</p>
          <p className="font-mono mt-2 text-sm max-w-2xl whitespace-pre-wrap">{error.message || error.data || JSON.stringify(error)}</p>
        </div>
      ) : (
        <p>Không tìm thấy trang (404).</p>
      )}
    </div>
  )
}
