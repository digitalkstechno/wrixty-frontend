import { apiGet, apiGetById, apiPost, apiPut, apiDelete } from './api';

export const fetchReturnOrders = async (params = {}) => {
  return await apiGet('/return-orders', params);
};

export const fetchReturnOrderById = async (id: string) => {
  return await apiGetById('/return-orders', id);
};

export const fetchStaffReturnStats = async () => {
  return await apiGet('/return-orders/stats/staff');
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
