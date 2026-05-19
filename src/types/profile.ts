export interface IExamSession {
  id: string
  score: number
  createdAt: string
  exam?: {
    title?: string
    totalMarks?: number
    passMarks?: number
    category?: { name?: string }
  }
}

export type ProfileFormValues = {
  name: string
  contactNo?: string
  address?: string
  gender: 'male' | 'female' | 'other'
}

export type ProfileUser = {
  id: string
  email: string
  name: string
  role: string
  contactNo?: string
  address?: string
  gender?: string
  profileImg?: string | null
}
