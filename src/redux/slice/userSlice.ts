import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { callFetchUser, callCreateUser, callUpdateUser, callDeleteUser } from '@/config/api'
import type { IUser, ICreateUser } from '@/types/backend'
/* =====================
   Thunk
===================== */
export const fetchUser = createAsyncThunk('user/fetchUser', async ({ query }: { query: string }) => {
  const res = await callFetchUser(query)
  return res.data
})

export const createUser = createAsyncThunk('user/createUser', async (user: ICreateUser) => {
  const res = await callCreateUser(user)
  return res.data
})

export const updateUser = createAsyncThunk('user/updateUser', async ({ user, id }: { user: IUser; id: string }) => {
  const res = await callUpdateUser(user, id)
  return res.data
})

export const deleteUser = createAsyncThunk('user/deleteUser', async ({ id }: { id: string }) => {
  const res = await callDeleteUser(id)
  return res.data
})

/* =====================
   State
===================== */
interface IState {
  isFetching: boolean
  meta: {
    limit: number
    page: number
    total: number
  }
  data: IUser[]
}

const initialState: IState = {
  isFetching: false,
  meta: {
    limit: 10,
    page: 1,
    total: 0
  },
  data: []
}

/* =====================
   Slice
===================== */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isFetching = true
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isFetching = false
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isFetching = false
        const payload = action.payload
        if (payload.success && payload.data) {
          state.data = payload.data
          if (payload.meta) {
            state.meta = payload.meta
          }
        } else {
          state.data = []
          state.meta = initialState.meta
        }
      })

      .addCase(createUser.pending, (state) => {
        state.isFetching = true
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isFetching = false
        const payload = action.payload
        if (payload.success && payload.data) {
          state.data.unshift(payload.data)
        }
      })
      .addCase(createUser.rejected, (state) => {
        state.isFetching = false
      })

      .addCase(updateUser.pending, (state) => {
        state.isFetching = true
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isFetching = false
        const payload = action.payload
        if (payload.success && payload.data) {
          const index = state.data.findIndex((u) => u.id === payload.data?.id)
          if (index !== -1) {
            state.data[index] = payload.data
          }
        }
      })
      .addCase(updateUser.rejected, (state) => {
        state.isFetching = false
      })

      .addCase(deleteUser.pending, (state) => {
        state.isFetching = true
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isFetching = false
        if (action.payload.success) {
          const deletedId = action.meta.arg.id
          state.data = state.data.filter((u) => u.id !== deletedId)
        }
      })
      .addCase(deleteUser.rejected, (state) => {
        state.isFetching = false
      })
  }
})

export default userSlice.reducer
