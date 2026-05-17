import { configureStore } from '@reduxjs/toolkit'
import accountReducer from './slice/accountSlice'
import userReducer from './slice/userSlice'
import categoryReducer from './slice/categorySlice'
import examReducer from './slice/examSlice'
import postReducer from './slice/postSlice'
import questionReducer from './slice/questionSlice'

export const store = configureStore({
  reducer: {
    account: accountReducer,
    user: userReducer,
    category: categoryReducer,
    exam: examReducer,
    post: postReducer,
    question: questionReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
