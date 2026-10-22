import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Movie } from '../models/movie';

@Injectable({ providedIn: 'root' })
export class MovieService {
  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http.get<any[]>('/movies').pipe(
      map(movies => {
        if (!movies || !Array.isArray(movies)) {
          console.error('Invalid response structure:', movies);
          return [];
        }
        return movies.map(m => this.mapMovie(m));
      }),
      catchError(err => {
        console.error('Error fetching movies:', err);
        return of([]);
      })
    );
  }

  getMovieById(id: string) {
    return this.http.get<any>(`/movies/${id}`).pipe(
      map((res) => this.mapMovie(res?.data ?? res)));
  }   

  addMovie(movie: Movie): Observable<any> {
    return this.http.post('/movies', movie);
  }

  deleteMovie(id: string): Observable<any> {
    return this.http.delete(`/movies/${id}`);
  }

  updateMovie(id: string, movie: Movie): Observable<any> {
    return this.http.put(`/movies/${id}`, movie);
  }

  private mapMovie(movie: any): Movie {
    return {
      id: movie._id,
      title: movie.title,
      poster: movie.poster,
      description: movie.description,
      duration: movie.duration,
      genre: movie.genre,
      date: new Date(movie.date)
    };
  }
}
