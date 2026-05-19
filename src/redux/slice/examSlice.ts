import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { callFetchExam, callCreateExam, callUpdateExam, callDeleteExam } from '@/config/api'
import type { IExam } from '@/types/backend'

/* =====================
   Thunk
===================== */
export const fetchExam = createAsyncThunk('exam/fetchExam', async ({ query }: { query?: string }) => {
  const res = await callFetchExam(query)
  return res.data
})

export const createExam = createAsyncThunk('exam/createExam', async (exam: Partial<IExam>) => {
  const res = await callCreateExam(exam)
  return res.data
})

export const updateExam = createAsyncThunk(
  'exam/updateExam',
  async ({ exam, id }: { exam: Partial<IExam>; id: string }) => {
    const res = await callUpdateExam(exam, id)
    return res.data
  }
)

export const deleteExam = createAsyncThunk('exam/deleteExam', async ({ id }: { id: string }) => {
  const res = await callDeleteExam(id)
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
  data: IExam[]
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
const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchExam.pending, (state) => {
        state.isFetching = true
      })
      .addCase(fetchExam.rejected, (state) => {
        state.isFetching = false
      })
      .addCase(fetchExam.fulfilled, (state, action) => {
        state.isFetching = false
        const payload = action.payload
        if (payload?.success && payload.data) {
          state.data = payload.data
          if (payload.meta) {
            state.meta = payload.meta
          }
        } else {
          state.data = []
          state.meta = initialState.meta
        }
      })

      .addCase(createExam.pending, (state) => {
        state.isFetching = true
      })
      .addCase(createExam.fulfilled, (state, action) => {
        state.isFetching = false
        const payload = action.payload
        if (payload?.success && payload.data) {
          state.data.unshift(payload.data)
        }
      })
      .addCase(createExam.rejected, (state) => {
        state.isFetching = false
      })

      .addCase(updateExam.pending, (state) => {
        state.isFetching = true
      })
      .addCase(updateExam.fulfilled, (state, action) => {
        state.isFetching = false
        const payload = action.payload
        if (payload?.success && payload.data) {
          const index = state.data.findIndex((e) => e.id === payload.data?.id)
          if (index !== -1) {
            state.data[index] = payload.data
          }
        }
      })
      .addCase(updateExam.rejected, (state) => {
        state.isFetching = false
      })

      .addCase(deleteExam.pending, (state) => {
        state.isFetching = true
      })
      .addCase(deleteExam.fulfilled, (state, action) => {
        state.isFetching = false
        if (action.payload?.success) {
          const deletedId = action.meta.arg.id
          state.data = state.data.filter((e) => e.id !== deletedId)
        }
      })
      .addCase(deleteExam.rejected, (state) => {
        state.isFetching = false
      })
  }
})

export default examSlice.reducer
