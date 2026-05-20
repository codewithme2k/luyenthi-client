import { useRouteError, Link } from 'react-router'

export default function NotFound() {
  const error: any = useRouteError()
  console.error('Router Error Caught:', error)

  // Xác định mã lỗi (mặc định là 404 nếu không có)
  const status = error?.status || 404
  const is404 = status === 404

  const title = is404 ? 'Không tìm thấy trang' : 'Oops! Đã xảy ra lỗi'
  const message = is404
    ? 'Xin lỗi, chúng tôi không thể tìm thấy trang mà bạn đang tìm kiếm. Có thể URL đã bị thay đổi hoặc không tồn tại.'
    : 'Đã có lỗi bất ngờ xảy ra trong quá trình xử lý. Vui lòng thử lại sau.'

  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center max-w-2xl w-full">
        {/* Số lỗi to, nổi bật */}
        <p className="text-3xl font-black text-indigo-600 sm:text-5xl">{status}</p>

        {/* Tiêu đề */}
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {title}
        </h1>

        {/* Lời nhắn thân thiện */}
        <p className="mt-6 text-base leading-7 text-gray-600">
          {message}
        </p>

        {/* Nút hành động */}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200"
          >
            Về trang chủ
          </Link>
          <button
            onClick={() => window.history.back()}
            className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
          >
            Quay lại <span aria-hidden="true">&rarr;</span>
          </button>
        </div>

        {/* Chi tiết lỗi kỹ thuật (ẩn đi với user thường, chỉ hiện rõ khi không phải 404) */}
        {!is404 && error && (
          <div className="mt-12 p-5 bg-red-50 rounded-xl text-left border border-red-100 shadow-sm transition-all">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <p className="text-sm font-semibold text-red-800">
                Chi tiết lỗi kỹ thuật:
              </p>
            </div>
            <div className="bg-white/60 p-4 rounded-lg overflow-x-auto border border-red-50">
              <p className="font-mono text-sm text-red-600 whitespace-pre-wrap break-words">
                <span className="font-bold">{error.statusText}</span>
                {error.statusText && (error.message || error.data) ? '\n' : ''}
                {error.message || error.data || JSON.stringify(error)}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}