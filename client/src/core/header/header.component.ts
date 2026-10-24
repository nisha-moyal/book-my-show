import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NzLayoutModule, NzButtonModule],
  template: `
    <nz-header class="header">
      <div class="header-container">
        <div class="logo-section" (click)="goHome()">
          <img
            src="https://miro.medium.com/v2/resize:fit:1200/0*BCseuUwSNAz8nDak.png"
            alt="BookMyShow"
            class="logo"
          />
        </div>

        <div class="auth-section">
          @if(isLoggedIn()) {
            <button nz-button nzType="primary" (click)="goToMyBookings()">View My Bookings</button>
            <button nz-button nzType="default" (click)="logout()">Logout</button>
          } @else {
            <button nz-button nzType="primary" (click)="register()">Register</button>
          }
        </div>
      </div>
    </nz-header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      padding: 0;
      height: 64px;
      line-height: 64px;
    }

    .header-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
    }

    .logo-section {
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .logo {
      height: 40px;
      object-fit: contain;
    }

    .auth-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  `]
})
export class HeaderComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  login(): void {
    this.router.navigate(['/login']);
  }

  register(): void {
    this.router.navigate(['/register']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!this.authService?.getToken();
  }

  goToMyBookings(): void {
    this.router.navigate(['/my-bookings']);
  }
}
