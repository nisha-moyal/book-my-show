import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../../core/services/movie.service';
import { UserService } from '../../../core/services/user.service';
import { Movie } from '../../../core/models/movie';

@Component({
  selector: 'home',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzGridModule, NzRateModule, NzButtonModule, FormsModule],
  template: `
    <div class="home-container">
      <div class="user-info" *ngIf="currentUser">
        <h2>Welcome, {{ currentUser?.data?.user?.name }}!</h2>
      </div>

      <h1>Now Showing</h1>

      <!-- <div nz-row [nzGutter]="[16, 16]">
        <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="8" [nzLg]="6" *ngFor="let movie of movies">
          <nz-card [nzCover]="coverTemplate" [nzHoverable]="true">
            <nz-card-meta
              [nzTitle]="movie.title"
              [nzDescription]="movie.genre">
            </nz-card-meta>

            <div class="rating">
              <nz-rate [ngModel]="Math.round(movie.rating / 2)" nzDisabled></nz-rate>
              <span class="rating-value">{{ movie.rating }}/10</span>
            </div>

            <button nz-button nzType="primary" nzBlock style="margin-top: 12px;">
              Book Now
            </button>
          </nz-card>

          <ng-template #coverTemplate>
            <img [src]="movie.image" alt="{{ movie.title }}" style="height: 300px; object-fit: cover;" />
          </ng-template>
        </div>
      </div> -->
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 40px auto;
      padding: 0 20px;
    }

    .user-info {
      margin-bottom: 24px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .user-info h2 {
      margin: 0 0 8px 0;
    }

    .user-info p {
      margin: 0;
      color: #666;
    }

    h1 {
      text-align: center;
      margin-bottom: 30px;
      font-size: 28px;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
    }

    .rating-value {
      font-weight: bold;
      color: #faad14;
    }
  `]
})
export class HomeComponent implements OnInit {
  private movieService = inject(MovieService);
  private userService = inject(UserService);

  movies: Movie[] = [];
  currentUser: any = null;
  Math = Math;

  async ngOnInit(): Promise<void> {
    // this.movies = this.movieService.getMovies();

    // try {
    //   this.currentUser = await this.userService.getCurrentUser();
    // } catch (error) {
    //   console.error('Failed to fetch current user', error);
    // }
  }
}
