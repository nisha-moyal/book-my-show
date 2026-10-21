import { Injectable } from '@angular/core';

export type UserRole = 'user' | 'owner' | 'admin';

@Injectable({ providedIn: 'root' })
export class AuthService {
  getRole(): UserRole | null {
    const role = localStorage.getItem('role');
    if (role === 'user' || role === 'owner' || role === 'admin') {
      return role;
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  getUser(): string | null {
    return localStorage.getItem('user');
  }

  isOwner(): boolean {
    return this.getRole() === 'owner';
  }
}
