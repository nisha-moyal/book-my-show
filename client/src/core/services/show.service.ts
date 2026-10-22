import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Show, ShowPayload } from '../models/show';

@Injectable({ providedIn: 'root' })
export class ShowService {
  private http = inject(HttpClient);

  private mapShow(s: any): Show {
    const movie = typeof s.movie === 'object' ? s.movie : null;
    const theater = typeof s.theater === 'object' ? s.theater : null;

    return {
      id: s._id,
      movieId: movie?._id ?? s.movie,
      movieTitle: movie?.title ?? movie?.name ?? '',
      theaterId: theater?._id ?? s.theater,
      date: s.date,
      time: s.time,
      ticketPrice: s.ticketPrice,
      bookedSeatsCount: s.bookedSeats?.length ?? 0
    };
  }

  getShowsByTheater(theaterId: string): Observable<Show[]> {
    return this.http
      .get<any>(`/shows/get-by-theater?theaterId=${theaterId}`)
      .pipe(map((res) => (res?.data ?? []).map((s: any) => this.mapShow(s))));
  }

  addShow(payload: ShowPayload): Observable<Show> {
    return this.http
      .post<any>('/shows/add', payload)
      .pipe(map((res) => this.mapShow(res?.data ?? res)));
  }
}
