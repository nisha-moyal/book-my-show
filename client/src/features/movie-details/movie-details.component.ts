import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MovieService } from '../../core/services/movie.service';
import { ShowService } from '../../core/services/show.service';
import { Movie } from '../../core/models/movie';
import { Show } from '../../core/models/show';

interface TheaterShow {
  theaterName: string;
  theaterAddress: string;
  shows: Show[];
}

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    NzButtonModule,
    NzCardModule,
    NzDatePickerModule,
    NzSpinModule
  ],
  template: `
    <div class="details-page">
      <button nz-button class="back-btn" (click)="goBack()">← Back</button>

      @if (movie) {
        <div class="movie-header">
          <img [src]="movie.poster" [alt]="movie.title" class="poster" />
          <div class="movie-info">
            <h1>{{ movie.title }}</h1>
            <p class="meta">{{ movie.genre }} • {{ movie.duration }} mins</p>
            <p class="meta">Release: {{ movie.date | date: 'mediumDate' }}</p>
            <p class="description">{{ movie.description }}</p>
          </div>
        </div>
      }

      <div class="shows-section">
        <div class="shows-header">
          <h2>Select Show</h2>
          <nz-date-picker
            [(ngModel)]="selectedDate"
            nzFormat="dd MMM yyyy"
            nzPlaceHolder="Select date"
            [nzAllowClear]="false"
            [nzDisabledDate]="disablePastDates"
            (ngModelChange)="onDateChange($event)">
          </nz-date-picker>
        </div>

        <nz-spin [nzSpinning]="loadingShows">
          @if (groupedShows.length > 0) {
            <div class="theaters-list">
              @for (group of groupedShows; track group.theaterName) {
                <nz-card class="theater-card">
                  <div class="theater-header">
                    <div>
                      <div class="theater-name">{{ group.theaterName }}</div>
                      <div class="theater-address">{{ group.theaterAddress }}</div>
                    </div>
                  </div>

                  <div class="timings">
                    @for (show of group.shows; track show.id) {
                      <button
                        nz-button
                        class="time-btn"
                        (click)="selectShow(show?.id || '')">
                        <span class="time">{{ show.time | date: 'shortTime' }}</span>
                        <span class="price">₹{{ show.ticketPrice }}</span>
                      </button>
                    }
                  </div>
                </nz-card>
              }
            </div>
          } @else {
            @if (!loadingShows) {
              <div class="empty-state">
                <p>No shows available for {{ selectedDate | date: 'mediumDate' }}</p>
              </div>
            }
          }
        </nz-spin>
      </div>
    </div>
  `,
  styles: [`
    .details-page {
      max-width: 1100px;
      margin: 0 auto;
      padding: 24px 20px 40px;
    }

    .back-btn {
      margin-bottom: 16px;
    }

    .movie-header {
      display: flex;
      gap: 24px;
      margin-bottom: 40px;
    }

    .poster {
      width: 220px;
      height: 320px;
      object-fit: cover;
      border-radius: 12px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
      flex-shrink: 0;
    }

    .movie-info {
      flex: 1;
    }

    .movie-info h1 {
      margin: 0 0 12px;
      font-size: 32px;
      font-weight: 700;
    }

    .meta {
      color: #666;
      margin: 6px 0;
      font-size: 14px;
    }

    .description {
      margin-top: 16px;
      line-height: 1.6;
      color: #333;
      font-size: 14px;
    }

    .shows-section {
      margin-top: 40px;
    }

    .shows-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      gap: 16px;
    }

    .shows-header h2 {
      margin: 0;
      font-size: 24px;
    }

    .theaters-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .theater-card {
      border-radius: 10px;
      border: 1px solid #e5e5e5;
    }

    .theater-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f0f0f0;
    }

    .theater-name {
      font-size: 18px;
      font-weight: 600;
      color: #111;
    }

    .theater-address {
      color: #888;
      font-size: 13px;
      margin-top: 4px;
    }

    .timings {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .time-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 90px;
      height: 60px;
      padding: 8px 12px;
      border: 2px solid #52c41a;
      color: #52c41a;
      border-radius: 6px;
      background: white;
      transition: all 0.2s ease;
    }

    .time-btn:hover {
      background: #f6ffed;
      border-color: #389e0d;
      color: #389e0d;
    }

    .time {
      font-size: 16px;
      font-weight: 600;
    }

    .price {
      font-size: 12px;
      color: #888;
      margin-top: 2px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #999;
    }

    @media (max-width: 768px) {
      .movie-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .shows-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .timings {
        gap: 8px;
      }

      .time-btn {
        min-width: 80px;
        height: 55px;
      }
    }
  `]
})
export class MovieDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private movieService = inject(MovieService);
  private showService = inject(ShowService);
  private message = inject(NzMessageService);

  movieId = '';
  movie: Movie | null = null;
  selectedDate: Date = new Date();
  groupedShows: TheaterShow[] = [];
  loadingShows = false;

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('movieId') ?? '';
    if (!this.movieId) {
      this.message.error('Movie not found');
      this.goBack();
      return;
    }
    this.loadMovie();
    this.loadShows();
  }

  loadMovie(): void {
    this.movieService.getMovieById(this.movieId).subscribe({
      next: (movie) => {
        this.movie = movie;
      },
      error: (err) => {
        this.message.error(err?.error?.message || 'Failed to load movie');
      }
    });
  }

  loadShows(): void {
    this.loadingShows = true;
    const formattedDate = this.formatDate(this.selectedDate);
    const dateObject = new Date(formattedDate);
    this.showService.getShowsByMovie(this.movieId, formattedDate).subscribe({
      next: (shows) => {
        this.groupedShows = this.groupByTheater(shows);
        this.loadingShows = false;
      },
      error: (err) => {
        this.loadingShows = false;
        this.message.error(err?.error?.message || 'Failed to load shows');
      }
    });
  }

  onDateChange(date: Date): void {
    if (!date) return;
    this.selectedDate = date;
    this.loadShows();
  }

  selectShow(showId: string): void {
    this.router.navigate(['/shows', showId]);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  disablePastDates = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    current.setHours(0, 0, 0, 0);
    return current < today;
  };

  private groupByTheater(shows: Show[]): TheaterShow[] {
    const groups = new Map<string, TheaterShow>();
  
    for (const show of shows) {
      if (!groups.has(show.theaterId)) {
        groups.set(show.theaterId, {
          theaterName: show.theaterName,
          theaterAddress: show.theaterAddress,
          shows: []
        });
      }
      groups.get(show.theaterId)!.shows.push(show);
    }
  
    return [...groups.values()];
  }
  

  private formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
