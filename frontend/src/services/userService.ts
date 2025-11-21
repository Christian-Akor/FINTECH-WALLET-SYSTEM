import api from '@/lib/api';
import { User } from '@/types';

export const userService = {
  async getUserByAccountNumber(accountNumber: string): Promise<{ success: boolean; data: Partial<User> }> {
    const response = await api.get(`/users/account/${accountNumber}`);
    return response.data;
  },

  async getUser(id: string): Promise<{ success: boolean; data: User }> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};
