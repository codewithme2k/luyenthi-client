import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from '@/components/ui/sonner.tsx'
import { Provider } from 'react-redux'
import { store } from '@/redux/store.ts'
import { ThemeProvider } from './components/ThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    <Provider store={store}>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <App />
      </ThemeProvider>
      <Toaster
        theme="light"               // Giao diện sáng
        richColors={true}          // Không dùng màu nền sặc sỡ cho loại success/error
        expand={false}              // Không tự động mở rộng các toast xếp chồng khi di chuột vào
        visibleToasts={10}           // Hiển thị tối đa 3 toast cùng lúc
        position="top-right"     // Vị trí xuất hiện ở góc dưới bên phải
        closeButton={true}         // Không hiển thị nút bấm tắt (X) nhanh
        offset="64px"               // Khoảng cách từ góc màn hình (Desktop)
        mobileOffset="16px"         // Khoảng cách từ góc màn hình (Mobile)
        dir="ltr"                   // Chữ chạy từ trái sang phải
        hotkey={['alt', 'T']}       // Phím tắt để focus vào các toast
        invert={false}              // Không đảo ngược màu sắc mặc định
        toastOptions={{
          duration: 3000,           // Mặc định mỗi toast tự ẩn sau 4 giây (4000ms)
        }}
        gap={14}                    // Khoảng cách giữa các toast là 14px
      />
    </Provider>
  </>
)
