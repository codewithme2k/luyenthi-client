export interface IBackendRes<T> {
  statusCode: number | string;
  error?: {
    path: string | number;
    message: string;
  };
  success: boolean;
  message: string;
  meta?: {
    limit: number;
    page: number;
    total: number;
  };
  data?: T;
}
export interface IModelPaginate<T> {
  meta: {
    limit: number;
    page: number;
    total: number;
  };
  data: T[];
}
export interface IAccount {
  accessToken: string;
  refreshToken: string;
  user: {
    name: string;
    id: string;
    email: string;
    role: string;
  };
}

export interface IGetAccount {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  gender?: string;
  address?: string;
  age?: number;
  contactNo?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}
export interface ICreateUser {
  name: string;
  email: string;
  password?: string;
  age: number;
  gender: string;
  address: string;
  contactNo?: string;
  updatedAt?: string;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IExam {
  id: string;
  title: string;
  description?: string;
  slug: string;
  categoryId: string;
  duration: number;
  totalMarks: number;
  passMarks: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IPost {
  id: string;
  title: string;
  content: string;
  slug: string;
  thumbnail?: string;
  isPublished: boolean;
  authorId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAnswerOption {
  id?: string;
  content: string;
  isCorrect: boolean;
  order: number;
  questionId?: string;
}

export interface IQuestion {
  id: string;
  content: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'FILL_BLANK' | 'ESSAY' | 'TRUE_FALSE' | 'MATCHING';
  score?: number;
  order: number;
  explanation?: string;
  examId: string;
  options?: IAnswerOption[];
  createdAt?: string;
  updatedAt?: string;
}
