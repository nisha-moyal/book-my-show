import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MovieDialogComponent } from './movie-dialog.component';
import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../core/models/movie';
import { MovieEditDialogComponent } from './movie-edit-dialog.component';

@Component({
  selector: 'movies-table',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzButtonModule],
  providers: [NzModalService],
  template: `
    <div class="movies-table-container">
      <div class="header">
        <h2>Movies Management</h2>

        <div class="actions">
          <button nz-button nzType="primary" (click)="openAddMovieDialog()">
            Add Movie
          </button>

          <button
            nz-button
            nzType="default"
            [disabled]="!selectedMovie"
            (click)="openEditMovieDialog()">
            Edit
          </button>

          <button
            nz-button
            nzDanger
            [disabled]="!selectedMovie"
            (click)="confirmDelete()">
            Delete
          </button>
        </div>
      </div>

      <nz-table [nzData]="movies" [nzBordered]="true">
        <thead>
          <tr>
            <th></th>
            <th>Poster</th>
            <th>Title</th>
            <th>Genre</th>
            <th>Duration</th>
            <th>Release Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          @for (movie of movies; track movie.id ?? $index) {
            <tr
              [class.selected-row]="selectedMovie?.id === movie.id"
              (click)="selectMovie(movie)">
              <td>
                <input
                  type="radio"
                  name="selectedMovie"
                  [checked]="selectedMovie?.id === movie.id" />
              </td>
              <td><img [src]="movie.poster" [alt]="movie.title" width="60" /></td>
              <td><strong>{{ movie.title }}</strong></td>
              <td>{{ movie.genre }}</td>
              <td>{{ movie.duration }} mins</td>
              <td>{{ movie.date | date:'mediumDate' }}</td>
              <td class="desc-cell">{{ movie.description }}</td>
            </tr>
          } @empty {
            <tr>
              <td colspan="7" style="text-align: center;">No movies found.</td>
            </tr>
          }
        </tbody>
      </nz-table>
    </div>
  `,
  styles: [`
    .movies-table-container {
      padding: 24px;
      background: #fff;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    img {
      border-radius: 4px;
      object-fit: cover;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .desc-cell {
      max-width: 300px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .selected-row {
      background-color: #e6f4ff;
    }

    tbody tr {
      cursor: pointer;
    }
  `]
})
export class MoviesTableComponent implements OnInit {
  private modalService = inject(NzModalService);
  private movieService = inject(MovieService);

  movies: Movie[] = [];
  selectedMovie: Movie | null = null;

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.movieService.getMovies().subscribe({
      next: (data) => {
        this.movies = data;
        if (this.selectedMovie) {
          this.selectedMovie =
            this.movies.find(m => m.id === this.selectedMovie?.id) ?? null;
        }
      },
      error: (err) => console.error('Error fetching movies:', err)
    });
  }

  selectMovie(movie: Movie): void {
    this.selectedMovie = movie;
  }

  openAddMovieDialog(): void {
    const modal = this.modalService.create({
      nzTitle: 'Add New Movie',
      nzContent: MovieDialogComponent,
      nzFooter: null,
      nzWidth: 600
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.movieService.addMovie(result).subscribe({
          next: () => this.loadMovies(),
          error: (err) => console.error('Failed to add movie:', err)
        });
      }
    });
  }

  openEditMovieDialog(): void {
    if (!this.selectedMovie) return;
  
    const movieId = this.selectedMovie.id;
    if (!movieId) return;
  
    const modal = this.modalService.create({
      nzTitle: 'Edit Movie',
      nzContent: MovieEditDialogComponent,
      nzData: this.selectedMovie,
      nzFooter: null,
      nzWidth: 600
    });
  
    modal.afterClose.subscribe((updatedMovie) => {
      if (!updatedMovie) return; // cancelled
  
      this.movieService.updateMovie(movieId, updatedMovie).subscribe({
        next: () => this.loadMovies(),
        error: (err) => console.error('Failed to update movie:', err)
      });
    });
  }
  

  confirmDelete(): void {
    if (!this.selectedMovie) return;

    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this movie?',
      nzContent: `Movie: ${this.selectedMovie.title}`,
      nzOkText: 'Yes',
      nzOkDanger: true,
      nzCancelText: 'No',
      nzOnOk: () => {
        const movieId = this.selectedMovie?.id;
        if (!movieId) return;

        this.movieService.deleteMovie(movieId).subscribe({
          next: () => {
            this.selectedMovie = null;
            this.loadMovies();
          },
          error: (err) => console.error('Failed to delete movie:', err)
        });
      }
    });
  }
}
