import { configureStore } from '@reduxjs/toolkit'
import accountReducer from './slice/accountSlice'

export const store = configureStore({
  reducer: {
    account: accountReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
