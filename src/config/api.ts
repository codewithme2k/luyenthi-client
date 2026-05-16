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

export const callFetchUser = (query: string) => {
  return axios.get(`/api/v1/user/get-all?${query}`)
}
