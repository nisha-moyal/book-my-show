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
        return movies.map(m => ({
          id: m._id,
          title: m.title,
          poster: m.poster,
          description: m.description,
          duration: m.duration,
          genre: m.genre,
          date: new Date(m.date)
        } as Movie));
      }),
      catchError(err => {
        console.error('Error fetching movies:', err);
        return of([]);
      })
    );
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
}
