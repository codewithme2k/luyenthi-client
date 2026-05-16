import { Mutex } from 'async-mutex'
import axiosClient from 'axios'
import type { IBackendRes } from '@/types/backend'

import type { EnhancedStore } from '@reduxjs/toolkit'
import type { AppDispatch } from '@/redux/store'
import { setRefreshTokenAction } from '@/redux/slice/accountSlice'

/* ===================== TYPES ===================== */
interface AccessTokenResponse {
  accessToken: string
}

type AppStore = EnhancedStore & { dispatch: AppDispatch }
console.log(import.meta.env.VITE_BACKEND_URL)
/* ===================== AXIOS INSTANCE ===================== */
const instance = axiosClient.create({
  baseURL: import.meta.env.VITE_BACKEND_URL as string,
  withCredentials: true
})

const mutex = new Mutex()
const NO_RETRY_HEADER = 'x-no-retry'

let store: AppStore

export const injectStore = (_store: AppStore) => {
  store = _store
}

/* ===================== REFRESH TOKEN ===================== */

const handleRefreshToken = async (): Promise<string | null> => {
  return mutex.runExclusive(async () => {
    try {
      const res = await instance.post<IBackendRes<AccessTokenResponse>>('/api/v1/auth/refresh')

      if (res.data.success && res.data.data?.accessToken) {
        return res.data.data.accessToken
      }

      return null
    } catch {
      return null
    }
  })
}

/* ===================== REQUEST INTERCEPTOR ===================== */
instance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  config.headers.Accept = 'application/json'
  config.headers['Content-Type'] = 'application/json; charset=utf-8'

  return config
})

/* ===================== RESPONSE INTERCEPTOR ===================== */
instance.interceptors.response.use(
  // 👉 unwrap AxiosResponse → backend payload
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    /* ===== 401 → refresh token ===== */
    if (
      originalRequest &&
      error.response &&
      error.response.status === 401 &&
      originalRequest.url !== '/api/v1/auth/login' &&
      !originalRequest.headers[NO_RETRY_HEADER]
    ) {
      originalRequest.headers[NO_RETRY_HEADER] = 'true'

      const accessToken = await handleRefreshToken()

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return instance.request(originalRequest)
      }
    }

    /* ===== Refresh fail → force logout ===== */
    if (
      originalRequest &&
      error.response &&
      error.response.status === 400 &&
      originalRequest.url === '/api/v1/auth/refresh' &&
      location.pathname.startsWith('/admin')
    ) {
      const message = error?.response?.data?.message ?? 'Có lỗi xảy ra, vui lòng đăng nhập lại.'

      if (store?.dispatch) {
        store.dispatch(setRefreshTokenAction({ status: true, message }))
      }
    }

    return Promise.reject(error)
  }
)

export default instance
