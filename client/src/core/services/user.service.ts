import { Injectable, inject } from "@angular/core";
import { User } from "../models/user";
import apiClient from ".";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  
  async register(user: User) {
    try {
      const response = await apiClient.post('/users/register', user);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async login(user: User) {
    try {
      const response = await apiClient.post('/users/login', user);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const response = await apiClient.get('/users/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  forgotPassword(payload: { email: string }) {
    return this.http.patch('/users/forget-password', payload);
  }
  
  resetPassword(email: string, payload: { otp: string; newPassword: string }) {
    return this.http.patch(`/users/reset-password/${email}`, payload);
  }
  
}
