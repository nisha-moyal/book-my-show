import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'admin-navigation',
  standalone: true,
  imports: [CommonModule, NzMenuModule],
  template: `
    <ul nz-menu nzMode="inline">
      <li nz-menu-item (click)="navigateTo('admin/movies')">
        <span>Manage Movies</span>
      </li>
      <li nz-menu-item (click)="navigateTo('admin/theaters')">
        <span>Manage Theaters</span>
      </li>
    </ul>
  `,
  styles: [`
    ul {
      height: 100%;
    }
  `]
})
export class AdminNavigationComponent {
  private router = inject(Router);

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
