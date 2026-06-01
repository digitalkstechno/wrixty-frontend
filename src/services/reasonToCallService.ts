import { apiGet, apiGetById, apiPost, apiPut, apiDelete, endPointApi } from './api';

export interface ReasonToCall {
  _id: string;
  name: string;
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

export type CreateReasonToCallPayload = Omit<ReasonToCall, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateReasonToCallPayload = Partial<CreateReasonToCallPayload>;

export interface FetchParams {
  page?: number;
  limit?: number;
  search?: string;
}

// GET /api/reason-to-calls?page=&limit=&search=
export const fetchReasonToCalls = async (params?: FetchParams): Promise<PaginatedResponse<ReasonToCall>> => {
  const { data } = await apiGet(endPointApi.reasonToCalls, params);
  return data;
};

// GET /api/reason-to-calls/:id
export const fetchReasonToCall = async (id: string): Promise<ReasonToCall> => {
  const { data } = await apiGetById(endPointApi.reasonToCalls, id);
  return data;
};

// POST /api/reason-to-calls
export const createReasonToCall = async (payload: CreateReasonToCallPayload): Promise<ReasonToCall> => {
  const { data } = await apiPost(endPointApi.reasonToCallCreate, payload);
  return data;
};

// PUT /api/reason-to-calls/:id
export const updateReasonToCall = async (id: string, payload: UpdateReasonToCallPayload): Promise<ReasonToCall> => {
  const { data } = await apiPut(endPointApi.reasonToCallUpdate, id, payload);
  return data;
};

// DELETE /api/reason-to-calls/:id
export const deleteReasonToCall = async (id: string): Promise<void> => {
  await apiDelete(endPointApi.reasonToCallDelete, id);
};

// GET /api/reason-to-calls/export?search=
export const exportReasonToCalls = async (search?: string): Promise<ReasonToCall[]> => {
  const { data } = await apiGet(endPointApi.reasonToCallExport, search ? { search } : undefined);
  return data;
};
