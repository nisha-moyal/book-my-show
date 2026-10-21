import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NzLayoutModule, NzMenuModule, NzButtonModule],
  template: `
    <nz-layout>
      <nz-header>
        <div class="header-content">
          <h1>BookMyShow</h1>
          <div *ngIf="isLoggedIn()">
            <button nz-button nzType="primary" (click)="navigateTo('admin')" *ngIf="isAdmin()">Admin</button>
            <button nz-button nzType="default" (click)="logout()">Logout</button>
          </div>
          <div *ngIf="!isLoggedIn()">
            <button nz-button nzType="primary" (click)="navigateTo('login')">Login</button>
            <button nz-button nzType="default" (click)="navigateTo('register')">Register</button>
          </div>
        </div>
      </nz-header>
      <nz-content>
        <router-outlet></router-outlet>
      </nz-content>
    </nz-layout>
  `,
  styles: [`
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
    }
    nz-header {
      padding: 0 24px;
    }
    nz-content {
      padding: 24px;
    }
  `]
})
export class AppComponent {
  private router = inject(Router);

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    return localStorage.getItem('role') === 'admin';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
