import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TheatersTableComponent } from '../admin/theaters-table.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-partner-dashboard',
  standalone: true,
  imports: [CommonModule, TheatersTableComponent],
  template: `
    <div class="partner-dashboard">
      <header class="dashboard-header">
        <h1>Partner Dashboard</h1>
        <p>Manage your theaters</p>
      </header>

      <section class="dashboard-section">
        <app-theaters-table></app-theaters-table>
      </section>
    </div>
  `,
  styles: [`
    .partner-dashboard {
      padding: 24px;
      background: #f5f7fa;
      min-height: 100vh;
    }
    .dashboard-header h1 {
      margin: 0;
      font-size: 24px;
    }
    .dashboard-header p {
      margin: 4px 0 20px;
      color: #666;
    }
    .dashboard-section {
      background: white;
      padding: 16px;
      border-radius: 8px;
    }
  `]
})
export class PartnerDashboardComponent {
  private authService = inject(AuthService);
}
