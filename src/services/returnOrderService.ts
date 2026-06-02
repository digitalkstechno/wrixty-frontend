import { apiGet, apiPost, apiPut, apiDelete } from './api';

export const fetchReturnOrders = async (params = {}) => {
  return await apiGet('/return-orders', params);
};

export const createReturnOrderApi = async (data: any) => {
  return await apiPost('/return-orders', data);
};

export const updateReturnOrderApi = async (id: string, data: any) => {
  return await apiPut('/return-orders', id, data);
};

export const deleteReturnOrderApi = async (id: string) => {
  return await apiDelete('/return-orders', id);
};
