import { Injectable } from '@angular/core';

export type UserRole = 'user' | 'owner' | 'admin';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

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

  getUser(): string | null {
    return localStorage.getItem('user');
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  isOwner(): boolean {
    return this.getRole() === 'owner';
  }

  login(token: string, role: UserRole, user: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('user', user);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  }
}
