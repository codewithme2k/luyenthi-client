import axios from '@/config/axios-customize'

export const callRegister = (
  name: string,
  email: string,
  password: string,
  gender: string,
  address: string,
  contact: string
) => {
  return axios.post('/api/v1/auth/signup', {
    name,
    email,
    password,
    gender,
    address,
    contactNo: contact
  })
}

export const callLogin = (email: string, password: string) => {
  return axios.post('/api/v1/auth/login', {
    email,
    password
  })
}

export const callFetchAccount = () => {
  return axios.get('/api/v1/user/profile')
}

export const callRefreshToken = () => {
  return axios.post('/api/v1/auth/refresh')
}

export const callLogout = () => {
  return axios.post('/api/v1/auth/logout')
}

export const callChangePassword = (currentPassword: string, newPassword: string) => {
  return axios.patch('/api/v1/auth/change-password', {
    currentPassword,
    newPassword
  })
}

export const callForgotPassword = (email: string) => {
  return axios.post('/api/v1/auth/forgot-password', {
    email
  })
}

export const callResetPassword = (token: string, password: string) => {
  return axios.post('/api/v1/auth/reset-password', {
    token,
    password
  })
}

// User Answer & Grading
export const callSubmitAnswer = (data: any) => {
  return axios.post('/api/v1/user-answer/submit', data)
}

export const callGradeAnswer = (id: string, isCorrect: boolean) => {
  return axios.patch(`/api/v1/user-answer/${id}/grade`, { isCorrect })
}

// Exam Sessions
export const callFetchExamSessions = (query: string = '') => {
  return axios.get(`/api/v1/exam-session?${query}`)
}

export const callFetchMySessions = (query: string = '') => {
  return axios.get(`/api/v1/exam-session/my-sessions?${query}`)
}

export const callFetchSessionDetails = (id: string) => {
  return axios.get(`/api/v1/exam-session/${id}`)
}

export const callFetchUser = (query: string) => {
  return axios.get(`/api/v1/user/get-all?${query}`)
}

export const callUpdateProfile = (data: any) => {
  return axios.patch('/api/v1/user/profile', data)
}

export const callUploadFile = (formData: FormData) => {
  return axios.post('/api/v1/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const callCreateUser = (user: any) => {
  return axios.post('/api/v1/auth/signup', user)
}

export const callUpdateUser = (user: any, id: string) => {
  return axios.patch(`/api/v1/user/${id}`, user)
}

export const callDeleteUser = (id: string) => {
  return axios.delete(`/api/v1/user/${id}`)
}

// Category
export const callFetchCategory = (query: string = '') => {
  return axios.get(`/api/v1/category?${query}`)
}
export const callCreateCategory = (category: any) => {
  return axios.post('/api/v1/category', category)
}
export const callUpdateCategory = (category: any, id: string) => {
  return axios.patch(`/api/v1/category/${id}`, category)
}
export const callDeleteCategory = (id: string) => {
  return axios.delete(`/api/v1/category/${id}`)
}

// Exam
export const callFetchExam = (query: string = '') => {
  return axios.get(`/api/v1/exam?${query}`)
}
export const callFetchExamById = (id: string) => {
  return axios.get(`/api/v1/exam/${id}`)
}
export const callFetchExamBySlug = (slug: string) => {
  return axios.get(`/api/v1/exam/slug/${slug}`)
}
export const callCreateExam = (exam: any) => {
  return axios.post('/api/v1/exam', exam)
}
export const callUpdateExam = (exam: any, id: string) => {
  return axios.patch(`/api/v1/exam/${id}`, exam)
}
export const callDeleteExam = (id: string) => {
  return axios.delete(`/api/v1/exam/${id}`)
}

export const callSubmitExam = (id: string, payload: { answers: Record<string, any>; timeSpent: number }) => {
  return axios.post(`/api/v1/exam/${id}/submit`, payload)
}

// Post
export const callFetchPost = (query: string = '') => {
  return axios.get(`/api/v1/post?${query}`)
}
export const callFetchPostBySlug = (slug: string) => {
  return axios.get(`/api/v1/post/slug/${slug}`)
}
export const callToggleLikePost = (id: string) => {
  return axios.post(`/api/v1/liked-post/${id}`)
}
export const callToggleSavePost = (id: string) => {
  return axios.post(`/api/v1/saved-post/${id}`)
}
export const callGetSavedPosts = () => {
  return axios.get('/api/v1/saved-post/list')
}
export const callGetLikedPosts = () => {
  return axios.get('/api/v1/liked-post/list')
}
export const callCreatePost = (post: any) => {
  return axios.post('/api/v1/post', post)
}
export const callUpdatePost = (post: any, id: string) => {
  return axios.patch(`/api/v1/post/${id}`, post)
}
export const callDeletePost = (id: string) => {
  return axios.delete(`/api/v1/post/${id}`)
}

// Question
export const callFetchQuestion = (query: string = '') => {
  return axios.get(`/api/v1/question?${query}`)
}
export const callCreateQuestion = (question: any) => {
  return axios.post('/api/v1/question', question)
}
export const callUpdateQuestion = (question: any, id: string) => {
  return axios.patch(`/api/v1/question/${id}`, question)
}
export const callDeleteQuestion = (id: string) => {
  return axios.delete(`/api/v1/question/${id}`)
}

// Membership Request
export const callCreateMembershipRequest = (payload: { plan: string; amount: number; transactionCode: string }) => {
  return axios.post('/api/v1/membership-request/create', payload)
}
export const callFetchAllMembershipRequests = (query: string = '') => {
  return axios.get(`/api/v1/membership-request/list?${query}`)
}
export const callFetchMyMembershipRequests = (query: string = '') => {
  return axios.get(`/api/v1/membership-request/my-requests?${query}`)
}
export const callApproveMembershipRequest = (id: string) => {
  return axios.post(`/api/v1/membership-request/approve/${id}`)
}
export const callRejectMembershipRequest = (id: string) => {
  return axios.post(`/api/v1/membership-request/reject/${id}`)
}

// Course & E-Learning API callers
export const callFetchCourses = (query: string = '') => {
  return axios.get(`/api/v1/course?${query}`)
}

export const callFetchCourseDetails = (idOrSlug: string) => {
  return axios.get(`/api/v1/course/${idOrSlug}`)
}

export const callCreateCourse = (payload: any) => {
  return axios.post('/api/v1/course', payload)
}

export const callUpdateCourse = (id: string, payload: any) => {
  return axios.patch(`/api/v1/course/${id}`, payload)
}

export const callDeleteCourse = (id: string) => {
  return axios.delete(`/api/v1/course/${id}`)
}

export const callBulkUploadSyllabus = (courseId: string, syllabusData: any[]) => {
  return axios.post(`/api/v1/course/${courseId}/bulk-syllabus`, syllabusData)
}


