import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-success',
  template: `
    <div class="success-page">
      <h2>Booking Successful!</h2>
      <p>Your tickets have been booked successfully.</p>
      <button nz-button nzType="primary" (click)="goHome()">Back to Home</button>
    </div>
  `,
  styles: [`
    .success-page {
      max-width: 600px;
      margin: 50px auto;
      padding: 30px;
      text-align: center;
      border-radius: 10px;
      background: #f9f9f9;
    }

    h2 {
      color: #52c41a;
      margin-bottom: 20px;
    }

    p {
      margin-bottom: 30px;
      font-size: 16px;
    }
  `]
})
export class BookingSuccessComponent {
    private router = inject(Router);

    goHome(): void {
        this.router.navigate(['/']);
    }
}
