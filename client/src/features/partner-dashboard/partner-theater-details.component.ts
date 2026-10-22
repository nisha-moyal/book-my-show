import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { TheaterService } from '../../core/services/theater.service';
import { ShowService } from '../../core/services/show.service';
import { Show } from '../../core/models/show';
import { ShowAddDialogComponent } from './show-add-dialog.component';

@Component({
  selector: 'app-partner-theater-details',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    NzCardModule,
    NzButtonModule,
    NzDescriptionsModule,
    NzModalModule
  ],
  template: `
    <div class="page-header">
      <button nz-button (click)="goBack()">← Back</button>
      <h2>{{ theater?.name }}</h2>
    </div>

    <nz-card nzTitle="Theater Details" class="details-card">
      @if (theater) {
        <nz-descriptions [nzColumn]="2">
          <nz-descriptions-item nzTitle="Name">{{ theater.name }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="Address">{{ theater.address }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="Email">{{ theater.email }}</nz-descriptions-item>
          <nz-descriptions-item nzTitle="Phone">{{ theater.phone }}</nz-descriptions-item>
        </nz-descriptions>
      }
    </nz-card>

    <div class="shows-section">
      <div class="shows-header">
        <h3>Shows</h3>
        <button nz-button nzType="primary" (click)="addShow()">Add Show</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Movie Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Ticket Price</th>
            <th>Booked Seats Count</th>
          </tr>
        </thead>
        <tbody>
          @for (show of shows; track show.id) {
            <tr>
              <td>{{ show.movieTitle }}</td>
              <td>{{ show.date }}</td>
              <td>{{ show.time | date: 'shortTime' }}</td>
              <td>₹{{ show.ticketPrice }}</td>
              <td>{{ show.bookedSeatsCount }}</td>
            </tr>
          } @empty {
            <tr>
              <td colspan="5" class="empty-cell">No show added</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }

    .page-header h2 {
      margin: 0;
    }

    .details-card {
      margin-bottom: 24px;
    }

    .shows-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .shows-header h3 {
      margin: 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: #fff;
    }

    th, td {
      border: 1px solid #e5e5e5;
      padding: 12px;
      text-align: left;
    }

    th {
      background: #f5f5f5;
    }

    .empty-cell {
      text-align: center;
      color: #888;
    }
  `]
})
export class PartnerTheaterDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private theaterService = inject(TheaterService);
  private showService = inject(ShowService);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);

  theaterId = '';
  theater: any = null;
  shows: Show[] = [];

  ngOnInit(): void {
    this.theaterId = this.route.snapshot.paramMap.get('theaterId') ?? '';
    this.loadTheater();
    this.loadShows();
  }

  loadTheater(): void {
    this.theaterService.getTheaterById(this.theaterId).subscribe({
      next: (res) => {
        this.theater = res?.data ?? res;
      },
      error: (err) => {
        this.message.error(err?.error?.message || 'Failed to load theater');
      }
    });
  }

  loadShows(): void {
    this.showService.getShowsByTheater(this.theaterId).subscribe({
      next: (shows) => {
        this.shows = shows;
      },
      error: (err) => {
        this.message.error(err?.error?.message || 'Failed to load shows');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/partner-dashboard']);
  }

  addShow(): void {
    const modalRef = this.modal.create({
      nzTitle: 'Add Show',
      nzContent: ShowAddDialogComponent,
      nzFooter: null,
      nzWidth: 600
    });

    modalRef.afterClose.subscribe((result) => {
      if (!result) return;

      const payload = {
        movie: result.movie,
        theater: this.theaterId,
        date: result.time.slice(0, 10),
        time: new Date(result.time).toISOString(),
        ticketPrice: result.ticketPrice
      };

      this.showService.addShow(payload).subscribe({
        next: () => {
          this.message.success('Show added');
          this.loadShows();
        },
        error: (err) => {
          this.message.error(err?.error?.message || 'Failed to add show');
        }
      });
    });
  }
}
