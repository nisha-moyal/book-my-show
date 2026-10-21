import { Injectable } from "@angular/core";
import { User } from "../models/user";
import apiClient from ".";

@Injectable({
  providedIn: 'root'
})
export class UserService {
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
}
