import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../core/models/movie';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    NzCardModule,
    NzButtonModule,
    NzSpinModule
  ],
  template: `
    <div class="home-page">
      <div class="banner">
        <h1>Book Your Favorite Movies</h1>
        <p>Discover the latest movies and book tickets easily</p>
      </div>

      <div class="movies-section">
        <div class="section-header">
          <h2>Recommended Movies</h2>
        </div>

        <nz-spin [nzSpinning]="loading">
          @if (movies.length > 0) {
            <div class="movies-grid">
              @for (movie of movies; track movie.id) {
                <nz-card class="movie-card" [nzCover]="coverTemplate">
                  <ng-template #coverTemplate>
                    <img
                      [src]="movie.poster"
                      [alt]="movie.title"
                      class="movie-poster"
                    />
                  </ng-template>

                  <div class="movie-content">
                    <h3>{{ movie.title }}</h3>
                    <p class="genre">{{ movie.genre }}</p>
                    <p class="duration">{{ movie.duration }} mins</p>
                    <p class="date">Release: {{ movie.date | date: 'mediumDate' }}</p>

                    <button
                      nz-button
                      nzType="primary"
                      nzBlock
                      (click)="bookMovie(movie)"
                    >
                      Book Now
                    </button>
                  </div>
                </nz-card>
              }
            </div>
          } @else {
            <div class="empty-state">
              <p>No movies available</p>
            </div>
          }
        </nz-spin>
      </div>
    </div>
  `,
  styles: [`
    .home-page {
      min-height: 100vh;
      background: #f5f5f5;
    }

    .banner {
      background: linear-gradient(135deg, #1d2671, #c33764);
      color: white;
      text-align: center;
      padding: 60px 20px;
      margin-bottom: 32px;
    }

    .banner h1 {
      font-size: 40px;
      font-weight: 700;
      margin-bottom: 12px;
    }

    .banner p {
      font-size: 18px;
      margin: 0;
      opacity: 0.9;
    }

    .movies-section {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px 40px;
    }

    .section-header {
      margin-bottom: 24px;
    }

    .section-header h2 {
      font-size: 28px;
      font-weight: 600;
      color: #222;
      margin: 0;
    }

    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 24px;
    }

    .movie-card {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .movie-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .movie-poster {
      width: 100%;
      height: 320px;
      object-fit: cover;
    }

    .movie-content {
      padding: 12px;
    }

    .movie-content h3 {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 8px;
      color: #111;
    }

    .genre,
    .duration,
    .date {
      margin: 4px 0;
      color: #666;
      font-size: 14px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #888;
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .banner h1 {
        font-size: 28px;
      }

      .banner p {
        font-size: 14px;
      }

      .movies-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 16px;
      }

      .movie-poster {
        height: 240px;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  private movieService = inject(MovieService);
  private message = inject(NzMessageService);
  private router = inject(Router);

  movies: Movie[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.loading = true;

    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.movies = movies;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.message.error(err?.error?.message || 'Failed to load movies');
      }
    });
  }

  bookMovie(movie: Movie): void {
    if (!movie.id) return;
    this.router.navigate(['/movies', movie.id]);
  }
}
