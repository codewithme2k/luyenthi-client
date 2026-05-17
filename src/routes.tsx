import { createBrowserRouter } from 'react-router'
import LoginPage from '@/pages/Auth/LoginPage'
import RegisterPage from '@/pages/Auth/RegisterPage'
import ForgotPasswordPage from '@/pages/Auth/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/Auth/ResetPasswordPage'
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
import ExamResultDetailsPage from '@/pages/ExamTest/ExamResultDetailsPage'
import RequireAuth from '@/components/Layout/RequireAuth'
import ProfilePage from '@/pages/Profile/ProfilePage'
import LeaderboardPage from '@/pages/Leaderboard/LeaderboardPage'

import { PremiumPage } from '@/pages/Premium/PremiumPage'
import { AdminMembershipPage } from '@/pages/Dashboard/AdminMembershipPage'
import { BlogPage } from '@/pages/Blog/BlogPage'
import { BlogDetailPage } from '@/pages/Blog/BlogDetailPage'

import { CoursePage } from '@/pages/Course/CoursePage'
import { CoursePlayerPage } from '@/pages/Course/CoursePlayerPage'
import { AdminCoursePage } from '@/pages/Dashboard/AdminCoursePage'
import { SyllabusBuilderPage } from '@/pages/Dashboard/SyllabusBuilderPage'

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
    path: '/forgot-password',
    element: <ForgotPasswordPage />
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />
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
        path: 'leaderboard',
        element: <LeaderboardPage />
      },
      {
        path: 'blog',
        element: <BlogPage />
      },
      {
        path: 'blog/:slug',
        element: <BlogDetailPage />
      },
      {
        path: 'courses',
        element: <CoursePage />
      },
      {
        path: 'course/:slug',
        element: <CoursePlayerPage />
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: 'exam/:slug',
            element: <ExamTestPage />
          },
          {
            path: 'exam-result/:sessionId',
            element: <ExamResultDetailsPage />
          },
          {
            path: 'user',
            element: <UserPage />
          },
          {
            path: 'profile',
            element: <ProfilePage />
          },
          {
            path: 'premium',
            element: <PremiumPage />
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
      },
      {
        path: 'membership-request',
        element: <AdminMembershipPage />
      },
      {
        path: 'course',
        element: <AdminCoursePage />
      },
      {
        path: 'course/:id/syllabus',
        element: <SyllabusBuilderPage />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
])
export default routes
