import api from '@/lib/api';
import { AuthResponse, RegisterRequest, LoginRequest, User } from '@/types';

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async getMe(): Promise<{ success: boolean; data: User }> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<{ success: boolean; data: User }> {
    const response = await api.put('/auth/updatedetails', data);
    return response.data;
  },

  async updatePassword(data: { currentPassword: string; newPassword: string }): Promise<{ success: boolean }> {
    const response = await api.put('/auth/updatepassword', data);
    return response.data;
  },

  async updatePin(data: { currentPin: string; newPin: string }): Promise<{ success: boolean }> {
    const response = await api.put('/auth/updatepin', data);
    return response.data;
  },
};
