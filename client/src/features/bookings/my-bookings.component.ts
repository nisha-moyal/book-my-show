import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ShowService } from '../../core/services/show.service';
import { Booking } from '../../core/models/booking';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzButtonModule, NzSpinModule, NzEmptyModule],
  template: `
    <div class="bookings-page">
      <button nz-button (click)="goBack()">← Back</button>
      <h2>My Bookings</h2>

      <nz-spin [nzSpinning]="loading">
        @if (!loading && bookings.length === 0) {
          <nz-empty nzNotFoundContent="No bookings yet"></nz-empty>
        }

        @for (booking of bookings; track booking._id) {
          <nz-card class="booking-card" [nzTitle]="booking.show.movie.title">
            <div class="row">
              <span class="label">Theater</span>
              <span>{{ booking.show.theater.name }}</span>
            </div>
            <div class="row">
              <span class="label">Address</span>
              <span>{{ booking.show.theater.address }}</span>
            </div>
            <div class="row">
              <span class="label">Date</span>
              <span>{{ booking.show.date | date: 'mediumDate' }}</span>
            </div>
            <div class="row">
              <span class="label">Time</span>
              <span>{{ booking.show.time | date: 'shortTime' }}</span>
            </div>
            <div class="row">
              <span class="label">Seats</span>
              <span>{{ booking.seats.join(', ') }}</span>
            </div>
            <div class="row">
              <span class="label">Total Paid</span>
              <span>₹{{ booking.seats.length * booking.show.ticketPrice }}</span>
            </div>

            <p class="meta">
              Booked on {{ booking.createdAt | date: 'medium' }} · Txn: {{ booking.transactionId }}
            </p>
          </nz-card>
        }
      </nz-spin>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .bookings-page {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      padding: 24px 20px 40px;
      box-sizing: border-box;
    }
    h2 { margin: 16px 0 24px; font-size: 26px; font-weight: 700; }
    .booking-card { width: 100%; margin-bottom: 16px; border-radius: 10px; }
    .row {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .row:last-of-type { border-bottom: none; }
    .label { color: #888; font-weight: 500; min-width: 100px; }
    .meta { color: #888; font-size: 12px; margin: 12px 0 0; }
  `]
})
export class MyBookingsComponent implements OnInit {
  private showService = inject(ShowService);
  private message = inject(NzMessageService);
  private router = inject(Router);

  bookings: Booking[] = [];
  loading = false;

  ngOnInit(): void {
    this.loading = true;
    this.showService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.message.error(err?.error?.message || 'Failed to load bookings');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
