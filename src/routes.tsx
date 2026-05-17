import { createBrowserRouter } from 'react-router'
import LoginPage from '@/pages/Auth/LoginPage'
import RegisterPage from '@/pages/Auth/RegisterPage'
import Dashboard from '@/pages/Dashboard/Dashboard'
import UserPage from '@/pages/Dashboard/UserPage'
import CategoryPage from '@/pages/Dashboard/CategoryPage'
import ExamPage from '@/pages/Dashboard/ExamPage'
import PostPage from '@/pages/Dashboard/PostPage'
import QuestionPage from '@/pages/Dashboard/QuestionPage'
import GradingPage from '@/pages/Dashboard/GradingPage'
import LayoutClient from '@/components/Layout/LayoutClient'
import NotFound from '@/components/Layout/NotFound'
import ProtectedRoute from '@/components/Layout/protectedRoute'
import LayoutApp from '@/components/Layout/LayoutApp'
import LayoutAdmin from '@/components/Layout/LayoutAdmin'
import HomePage from '@/pages/Homepage'
import UserExamPage from '@/pages/UserExamPage'
import ExamTestPage from '@/pages/ExamTest/ExamTestPage'
import RequireAuth from '@/components/Layout/RequireAuth'
import ProfilePage from '@/pages/Profile/ProfilePage'

const routes = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/',
    element: (
      <LayoutApp>
        <LayoutClient />
      </LayoutApp>
    ),
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'exams',
        element: <UserExamPage />
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: 'exam/:slug',
            element: <ExamTestPage />
          },
          {
            path: 'user',
            element: <UserPage />
          },
          {
            path: 'profile',
            element: <ProfilePage />
          }
        ]
      }
    ]
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <LayoutAdmin />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'user',
        element: <UserPage />
      },
      {
        path: 'category',
        element: <CategoryPage />
      },
      {
        path: 'exam',
        element: <ExamPage />
      },
      {
        path: 'post',
        element: <PostPage />
      },
      {
        path: 'question',
        element: <QuestionPage />
      },
      {
        path: 'grading',
        element: <GradingPage />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
])
export default routes
