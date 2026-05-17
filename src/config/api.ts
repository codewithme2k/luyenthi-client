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

