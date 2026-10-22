import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Show, ShowPayload } from '../models/show';
import { Booking } from '../models/booking';

@Injectable({ providedIn: 'root' })
export class ShowService {
  private http = inject(HttpClient);

  private mapShow(s: any): Show {
    const theater =
      s.theater && typeof s.theater === 'object' ? s.theater : null;
    const movie = s.movie && typeof s.movie === 'object' ? s.movie : null;

    return {
      id: s._id,
      movieId: movie?._id ?? s.movie,
      movieTitle: movie?.title ?? '',
      theaterId: theater?._id ?? s.theater,
      theaterName: theater?.name ?? '',
      theaterAddress: theater?.address ?? '',
      date: s.date,
      time: s.time,
      ticketPrice: s.ticketPrice,
      bookedSeatsCount: s.bookedSeats?.length ?? 0,
    };
  }

  getShowsByMovie(movieId: string, date: string): Observable<Show[]> {
    return this.http
      .get<any>(`/shows/get-by-movie?movieId=${movieId}&date=${date}`)
      .pipe(map((res) => (res?.data ?? []).map((s: any) => this.mapShow(s))));
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

  getShowById(id: string) {
    return this.http
      .get<any>(`/shows/${id}`)
      .pipe(map((res) => this.mapShow(res?.data ?? res)));
  }

  createCheckoutSession(payload: {
    showId: string;
    seats: string[];
  }): Observable<{ sessionId: string; clientSecret: string }> {
    return this.http.post<{ sessionId: string; clientSecret: string }>(
      '/payments/create-checkout-session',
      payload
    );
  }

  verifyPayment(sessionId: string) {
    return this.http.get<{
      paymentStatus: string;
      transactionId: string | null;
    }>(`/payments/verify?session_id=${sessionId}`);
  }

  bookShow(payload: {
    showId: string;
    seats: string[];
    transactionId: string;
  }) {
    return this.http.post('/shows/book', payload);
  }

  getMyBookings() {
    return this.http
      .get<any[]>('/shows/my-bookings')
      .pipe(map((bookings) => bookings.map(this.mapBooking)));
  }

  private mapBooking(data: any): Booking {
    return {
      _id: data._id,
      show: {
        _id: data.show?._id ?? '',
        date: data.show?.date ?? '',
        time: data.show?.time ?? '',
        ticketPrice: data.show?.ticketPrice ?? 0,
        movie: {
          _id: data.show?.movie?._id ?? '',
          title: data.show?.movie?.title ?? 'Unknown Movie'
        },
        theater: {
          _id: data.show?.theater?._id ?? '',
          name: data.show?.theater?.name ?? 'Unknown Theater',
          address: data.show?.theater?.address ?? ''
        }
      },
      user: data.user,
      seats: data.seats ?? [],
      transactionId: data.transactionId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  }
}
