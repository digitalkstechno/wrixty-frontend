import api, { apiGet, apiGetById, apiPost, apiPut, apiDelete, endPointApi } from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  mobile_number: string;
  company_number: string;
  aadhar_card: string;
  check_photo?: string;
  bank_number: string;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type CreateUserPayload = Omit<User, '_id' | 'createdAt' | 'updatedAt'> & { password?: string };
export type UpdateUserPayload = Partial<CreateUserPayload>;

export interface FetchParams {
  page?: number;
  limit?: number;
  search?: string;
}

// GET /api/users?page=&limit=&search=
export const fetchUsers = async (params?: FetchParams): Promise<PaginatedResponse<User>> => {
  const { data } = await apiGet(endPointApi.users, params);
  return data;
};

// GET /api/users/:id
export const fetchUser = async (id: string): Promise<User> => {
  const { data } = await apiGetById(endPointApi.users, id);
  return data;
};

// POST /api/users
export const createUser = async (payload: CreateUserPayload | FormData): Promise<User> => {
  const { data } = await api.post(endPointApi.userCreate, payload, {
    headers: {
      'Content-Type': payload instanceof FormData ? 'multipart/form-data' : 'application/json',
    }
  });
  return data;
};

// PUT /api/users/:id
export const updateUser = async (id: string, payload: UpdateUserPayload | FormData): Promise<User> => {
  const { data } = await api.put(`${endPointApi.userUpdate}/${id}`, payload, {
    headers: {
      'Content-Type': payload instanceof FormData ? 'multipart/form-data' : 'application/json',
    }
  });
  return data;
};

// DELETE /api/users/:id
export const deleteUser = async (id: string): Promise<void> => {
  await apiDelete(endPointApi.userDelete, id);
};

// POST /api/upload
export const uploadFile = async (file: File): Promise<{ file_url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post(endPointApi.upload, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};
