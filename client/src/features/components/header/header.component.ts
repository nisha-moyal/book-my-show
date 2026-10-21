import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NzMenuModule],
  template: `
    <div class="header">
      <div class="logo">BookMyShow</div>

      <ul nz-menu nzTheme="dark" nzMode="horizontal" class="nav-menu">
        <li nz-menu-item><a routerLink="/home">Home</a></li>
        <li nz-menu-item><a routerLink="/login">Login</a></li>
        <li nz-menu-item><a routerLink="/register">Register</a></li>
        <li nz-menu-item><a routerLink="/about">About</a></li>
        <li nz-menu-item><a routerLink="/bookings">My Bookings</a></li>
        <li nz-menu-item (click)="logout()">Logout</li>
      </ul>
    </div>
  `,
  styles: [`
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #001529;
      padding: 0 24px;
      height: 64px;
    }

    .logo {
      color: white;
      font-size: 20px;
      font-weight: bold;
      white-space: nowrap;
    }

    .nav-menu {
      flex: 1;
      justify-content: flex-end;
      border-bottom: none;
      background: transparent;
    }

    .nav-menu a {
      color: white;
    }
  `]
})
export class HeaderComponent {
  logout() {
    console.log('Logout clicked');
  }
}
