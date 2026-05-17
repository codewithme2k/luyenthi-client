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
    element: <LoginPage />,
    handle: { title: 'Đăng nhập' }
  },
  {
    path: '/register',
    element: <RegisterPage />,
    handle: { title: 'Đăng ký tài khoản' }
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
    handle: { title: 'Quên mật khẩu' }
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
    handle: { title: 'Đặt lại mật khẩu' }
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
        element: <HomePage />,
        handle: { title: 'Trang chủ' }
      },
      {
        path: 'exams',
        element: <UserExamPage />,
        handle: { title: 'Danh sách đề thi' }
      },
      {
        path: 'leaderboard',
        element: <LeaderboardPage />,
        handle: { title: 'Bảng xếp hạng' }
      },
      {
        path: 'blog',
        element: <BlogPage />,
        handle: { title: 'Cẩm nang học tập' }
      },
      {
        path: 'blog/:slug',
        element: <BlogDetailPage />,
        handle: { title: 'Chi tiết bài viết' }
      },
      {
        path: 'courses',
        element: <CoursePage />,
        handle: { title: 'Khóa học online' }
      },
      {
        path: 'course/:slug',
        element: <CoursePlayerPage />,
        handle: { title: 'Khóa học' }
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: 'exam/:slug',
            element: <ExamTestPage />,
            handle: { title: 'Luyện thi' }
          },
          {
            path: 'exam-result/:sessionId',
            element: <ExamResultDetailsPage />,
            handle: { title: 'Kết quả thi' }
          },
          {
            path: 'user',
            element: <UserPage />,
            handle: { title: 'Quản lý tài khoản' }
          },
          {
            path: 'profile',
            element: <ProfilePage />,
            handle: { title: 'Hồ sơ cá nhân' }
          },
          {
            path: 'premium',
            element: <PremiumPage />,
            handle: { title: 'Nâng cấp Premium' }
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
        element: <Dashboard />,
        handle: { title: 'Trang quản trị' }
      },
      {
        path: 'user',
        element: <UserPage />,
        handle: { title: 'Quản lý người dùng' }
      },
      {
        path: 'category',
        element: <CategoryPage />,
        handle: { title: 'Quản lý danh mục' }
      },
      {
        path: 'exam',
        element: <ExamPage />,
        handle: { title: 'Quản lý đề thi' }
      },
      {
        path: 'post',
        element: <PostPage />,
        handle: { title: 'Quản lý bài viết' }
      },
      {
        path: 'question',
        element: <QuestionPage />,
        handle: { title: 'Quản lý câu hỏi' }
      },
      {
        path: 'grading',
        element: <GradingPage />,
        handle: { title: 'Chấm thi' }
      },
      {
        path: 'membership-request',
        element: <AdminMembershipPage />,
        handle: { title: 'Yêu cầu kích hoạt thành viên' }
      },
      {
        path: 'course',
        element: <AdminCoursePage />,
        handle: { title: 'Quản lý khóa học' }
      },
      {
        path: 'course/:id/syllabus',
        element: <SyllabusBuilderPage />,
        handle: { title: 'Xây dựng giáo trình' }
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />,
    handle: { title: '404 - Không tìm thấy trang' }
  }
])
export default routes
