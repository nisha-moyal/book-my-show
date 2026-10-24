import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { loadStripe } from '@stripe/stripe-js';
import { ShowService } from '../../core/services/show.service';
import { Show } from '../../core/models/show';

@Component({
  selector: 'app-show-details',
  standalone: true,
  imports: [CommonModule, DatePipe, NzCardModule, NzButtonModule, NzSpinModule],
  template: `
    <div class="show-details-page">
      <button nz-button class="back-btn" (click)="goBack()">← Back</button>

      <nz-spin [nzSpinning]="loading">
        @if (show) {
          <nz-card class="movie-card">
            <h2>{{ show.movieTitle }}</h2>
            <div class="movie-meta">
              <p><strong>Theater:</strong> {{ show.theaterName }}</p>
              <p><strong>Date:</strong> {{ show.date | date: 'mediumDate' }}</p>
              <p><strong>Time:</strong> {{ show.time | date: 'shortTime' }}</p>
              <p><strong>Ticket Price:</strong> ₹{{ show.ticketPrice }}</p>
            </div>
          </nz-card>

          @if (!showPaymentForm) {
            <nz-card class="seat-card">
              <h3>Select Seats</h3>

              <div class="screen">SCREEN</div>

              <div class="seat-layout">
                @for (row of seatRows; track row) {
                  <div class="seat-row">
                    <div class="row-label">{{ row }}</div>

                    @for (seatNumber of seatNumbers; track seatNumber) {
                      <button
                        nz-button
                        class="seat-btn"
                        [class.selected]="isSeatSelected(row + seatNumber)"
                        (click)="toggleSeat(row + seatNumber)">
                        {{ row }}{{ seatNumber }}
                      </button>
                    }
                  </div>
                }
              </div>

              <div class="selected-info">
                <p><strong>Selected Seats:</strong> {{ selectedSeats.length ? selectedSeats.join(', ') : 'None' }}</p>
                <p><strong>Total Price:</strong> ₹{{ totalPrice() }}</p>
              </div>

              <button
                nz-button
                nzType="primary"
                class="pay-btn"
                [disabled]="!selectedSeats.length || paying"
                (click)="payNow()">
                {{ paying ? 'Processing...' : 'Pay Now' }}
              </button>
            </nz-card>
          }

          @if (showPaymentForm) {
            <nz-card class="payment-card">
              <h3>Complete Payment</h3>
              <div id="checkout"></div>
            </nz-card>
          }
        }
      </nz-spin>
    </div>
  `,
  styles: [`
    .show-details-page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 24px 20px 40px;
    }

    .back-btn {
      margin-bottom: 16px;
    }

    .movie-card,
    .seat-card,
    .payment-card {
      margin-bottom: 20px;
      border-radius: 10px;
    }

    .movie-card h2 {
      margin-bottom: 16px;
      font-size: 28px;
      font-weight: 700;
    }

    .movie-meta p {
      margin: 8px 0;
      color: #444;
      font-size: 15px;
    }

    .screen {
      width: 260px;
      margin: 0 auto 24px;
      text-align: center;
      padding: 10px;
      border-radius: 20px;
      background: linear-gradient(to right, #dfe9f3, #ffffff);
      color: #333;
      font-weight: 600;
      letter-spacing: 1px;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
    }

    .seat-layout {
      display: flex;
      flex-direction: column;
      gap: 12px;
      overflow-x: auto;
      align-items: center;
    }

    .seat-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: nowrap;
    }

    .row-label {
      width: 24px;
      font-weight: 600;
      color: #555;
    }

    .seat-btn {
      min-width: 52px;
      height: 38px;
      border-radius: 8px;
      border: 1px solid #d9d9d9;
      background: #fff;
      color: #333;
      font-size: 12px;
      transition: all 0.2s ease;
    }

    .seat-btn:hover {
      border-color: #52c41a;
      color: #52c41a;
    }

    .seat-btn.selected {
      background: #52c41a;
      border-color: #52c41a;
      color: #fff;
    }

    .selected-info {
      margin-top: 20px;
      margin-bottom: 16px;
      font-size: 14px;
      color: #333;
    }

    .pay-btn {
      width: 100%;
      max-width: 200px;
      height: 42px;
      border-radius: 8px;
      font-weight: 600;
    }

    #checkout {
      margin-top: 20px;
      padding: 20px;
      border: 1px solid #f0f0f0;
      border-radius: 8px;
    }
  `]
})
export class ShowDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private showService = inject(ShowService);
  private message = inject(NzMessageService);
  private sessionId = '';

  showId = '';
  show: Show | null = null;
  loading = false;
  paying = false;
  showPaymentForm = false;

  seatRows: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  seatNumbers: number[] = Array.from({ length: 12 }, (_, i) => i + 1);

  selectedSeats: string[] = [];

  private checkout: any;
  private stripePublishableKey: any;

  ngOnInit(): void {
    this.initializeStripe();
    this.showId = this.route.snapshot.paramMap.get('showId') ?? '';
    if (!this.showId) {
      this.message.error('Show not found');
      this.goBack();
      return;
    }
    this.loadShow();
  }

  loadShow(): void {
    this.loading = true;
    this.showService.getShowById(this.showId).subscribe({
      next: (show) => {
        this.show = show;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.message.error(err?.error?.message || 'Failed to load show details');
      }
    });
  }

  toggleSeat(seat: string): void {
    if (this.isSeatSelected(seat)) {
      this.selectedSeats = this.selectedSeats.filter(s => s !== seat);
    } else {
      this.selectedSeats = [...this.selectedSeats, seat];
    }
  }

  isSeatSelected(seat: string): boolean {
    return this.selectedSeats.includes(seat);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  totalPrice(): number {
    return (this.show?.ticketPrice ?? 0) * this.selectedSeats.length;
  }

  async payNow(): Promise<void> {
    if (!this.show || !this.selectedSeats.length) {
      this.message.warning('Please select at least one seat');
      return;
    }

    this.paying = true;

    this.showService.createCheckoutSession({
      showId: this.showId,
      seats: this.selectedSeats
    }).subscribe({
      next: async (res) => {
        if (res.clientSecret) {
          this.sessionId = res.sessionId;
          await this.mountPaymentForm(res.clientSecret);
          this.paying = false;
        } else {
          this.paying = false;
          this.message.error('Client secret not received');
        }
      },
      
      error: (err) => {
        this.paying = false;
        this.message.error(err?.error?.message || 'Failed to start payment');
      }
    });
  }

  private async mountPaymentForm(clientSecret: string): Promise<void> {
    const stripe: any = await loadStripe(this.stripePublishableKey);
  
    if (!stripe) {
      this.message.error('Stripe failed to load');
      return;
    }
  
    this.showPaymentForm = true;
  
    setTimeout(async () => {
      try {
        this.checkout = await stripe.createEmbeddedCheckoutPage({
          clientSecret,
          onComplete: () => {
            console.log('Payment process finished');
            this.handlePaymentCompletion();
          }
        });
  
        if (this.checkout) {
          this.checkout.mount('#checkout');
        }
      } catch (error) {
        this.message.error('Failed to load payment form');
        this.showPaymentForm = false;
        this.paying = false;
      }
    });
  }
  
  private handlePaymentCompletion(): void {
    if (!this.sessionId) {
      this.message.error('Session ID not found');
      this.resetPaymentForm();
      return;
    }
  
    this.showService.verifyPayment(this.sessionId).subscribe({
      next: (res) => {
        if (res.paymentStatus === 'success' && res.transactionId) {
          this.message.success('Payment successful');
          console.log('Transaction ID:', res.transactionId);
  
          // Book the show
          this.bookShow(res.transactionId);
        } else {
          this.message.error('Payment failed');
          this.resetPaymentForm();
        }
      },
      error: () => {
        this.message.error('Payment failed');
        this.resetPaymentForm();
      }
    });
  }
  
  private bookShow(transactionId: string): void {
    if (!this.show) {
      this.message.error('Show details not found');
      this.resetPaymentForm();
      return;
    }
  
    this.showService.bookShow({
      showId: this.showId,
      seats: this.selectedSeats,
      transactionId
    }).subscribe({
      next: () => {
        this.message.success('Booking successful');
        this.router.navigate(['/booking-success']);
      },
      error: (err) => {
        this.message.error(err?.error?.message || 'Failed to book show');
        this.resetPaymentForm();
      }
    });
  }
  

  private resetPaymentForm(): void {
    this.checkout?.destroy();
    this.checkout = undefined;
    this.showPaymentForm = false;
    this.paying = false;
  }

  private initializeStripe() {
    this.showService.getStripePublishableKey().subscribe({
      next: ({ publishableKey }) => {
        this.stripePublishableKey = publishableKey;
      },
      error: (err) => console.error('Failed to load Stripe config:', err),
    });
  }
  
}
