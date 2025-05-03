import api from './api';
import type { User } from '../types/auth.interface';

export const UserService = {
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/protected');
    return response.data;
  }
};