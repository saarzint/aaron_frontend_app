import apiClient from '../apiClient';

export interface Order {
  id: string;
  status: string;
  customer: string;
  total: number;
  createdAt: string;
}

export const getOrders = async (): Promise<Order[]> =>
  apiClient.get<Order[]>('/orders').then((res) => res.data);
