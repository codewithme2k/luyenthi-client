import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from '@/components/ui/sonner.tsx'
import { Provider } from 'react-redux'
import { store } from '@/redux/store.ts'
import { ThemeProvider } from './components/ThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <App />
      </ThemeProvider>
      <Toaster closeButton={true} position='top-right' richColors={true} />
    </Provider>
  </StrictMode>
)
