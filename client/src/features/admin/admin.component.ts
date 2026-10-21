import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AdminNavigationComponent } from './admin-navigation.component';

@Component({
  selector: 'admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminNavigationComponent],
  template: `
    <div class="admin-container">
      <h1>Admin Dashboard</h1>
      <div class="admin-layout">
        <admin-navigation></admin-navigation>
        <div class="admin-content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      height: calc(100vh - 100px);
    }
    .admin-content {
      flex-grow: 1;
      padding: 20px;
      overflow: auto;
    }
  `]
})
export class AdminComponent {}
