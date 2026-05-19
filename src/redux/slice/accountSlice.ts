import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { callFetchAccount } from '@/config/api'
import type { IBackendRes, IGetAccount } from '@/types/backend'

export const fetchAccount = createAsyncThunk<IBackendRes<IGetAccount>, void>('account/fetchAccount', async () => {
  const res = await callFetchAccount()
  return res.data
})

/* ===================== STATE ===================== */
interface IState {
  isAuthenticated: boolean
  isLoading: boolean
  isRefreshToken: boolean
  errorRefreshToken: string
  user: {
    id: string
    email: string
    name: string
    role: string
    contactNo?: string
    address?: string
    gender?: string
    profileImg?: string | null
    isPremium?: boolean
    premiumUntil?: string
  }
  activeMenu: string
}

const initialState: IState = {
  isAuthenticated: false,
  isLoading: true,
  isRefreshToken: false,
  errorRefreshToken: '',
  user: {
    id: '',
    email: '',
    name: '',
    role: '',
    contactNo: '',
    address: '',
    gender: 'male',
    profileImg: null,
    isPremium: false,
    premiumUntil: ''
  },
  activeMenu: 'home'
}

/* ===================== SLICE ===================== */
export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setActiveMenu: (state, action) => {
      state.activeMenu = action.payload
    },

    setUserLoginInfo: (state, action) => {
      state.isAuthenticated = true
      state.isLoading = false
      state.user = action.payload
    },

    setLogoutAction: (state) => {
      localStorage.removeItem('accessToken')
      state.isAuthenticated = false
      state.user = {
        id: '',
        email: '',
        name: '',
        role: '',
        isPremium: false,
        premiumUntil: ''
      }
    },

    setRefreshTokenAction: (state, action) => {
      state.isRefreshToken = action.payload?.status ?? false
      state.errorRefreshToken = action.payload?.message ?? ''
    },

    updateAccount: (state, action) => {
      state.user = { ...state.user, ...action.payload.user }
    }
  },

  extraReducers: (builder) => {
    /* ===== PENDING ===== */
    builder.addCase(fetchAccount.pending, (state) => {
      state.isAuthenticated = false
      state.isLoading = true
    })

    /* ===== FULFILLED ===== */
    builder.addCase(fetchAccount.fulfilled, (state, action) => {
      const user = action.payload.data
      if (user) {
        state.isAuthenticated = true
        state.isLoading = false
        state.user.id = user.id
        state.user.email = user.email
        state.user.name = user.name
        state.user.role = user.role
        state.user.contactNo = (user as any).contactNo || ''
        state.user.address = (user as any).address || ''
        state.user.gender = (user as any).gender || 'male'
        state.user.profileImg = (user as any).profileImg || null
        state.user.isPremium = user.isPremium ?? false
        state.user.premiumUntil = user.premiumUntil ?? ''
      } else {
        state.isAuthenticated = false
        state.isLoading = false
      }
    })

    /* ===== REJECTED ===== */
    builder.addCase(fetchAccount.rejected, (state) => {
      state.isAuthenticated = false
      state.isLoading = false
    })
  }
})

export const { setActiveMenu, setUserLoginInfo, setLogoutAction, setRefreshTokenAction, updateAccount } =
  accountSlice.actions

export default accountSlice.reducer
