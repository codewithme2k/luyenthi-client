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
  createdAt?: string;
  updatedAt?: string;
}
