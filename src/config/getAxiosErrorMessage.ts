import { AxiosError } from 'axios'
interface IErrorResponse {
  success: false
  message: string
  errorMessages?: {
    path: string
    message: string
  }[]
}
export const getAxiosErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as IErrorResponse | undefined
    return data?.message || data?.errorMessages?.[0]?.message || 'Lỗi kết nối đến server'
  }
  return 'Lỗi không xác định'
}
