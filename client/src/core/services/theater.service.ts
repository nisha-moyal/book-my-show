import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Theater } from '../models/theater';

@Injectable({
  providedIn: 'root'
})
export class TheaterService {
  constructor(private http: HttpClient) {}

  private mapTheater(t: any): Theater {
    return {
      id: t._id,
      name: t.name,
      address: t.address,
      email: t.email,
      phone: t.phone,
      owner: t.owner,
      isActive: t.isActive,
      approvalStatus: t.isActive ? 'approved' : 'pending'
    };
  }

  getMyTheaters(): Observable<Theater[]> {
    return this.http.get<any[]>('/theatres/mine').pipe(
      map((theatres) => theatres.map((t) => this.mapTheater(t)))
    );
  }

  getTheaters(): Observable<Theater[]> {
    return this.http.get<any[]>('/theatres').pipe(
      map((theatres) => theatres.map((t) => this.mapTheater(t)))
    );
  }

  getPendingTheaters(): Observable<Theater[]> {
    return this.http.get<any[]>('/theatres/pending').pipe(
      map((theatres) => theatres.map((t) => this.mapTheater(t)))
    );
  }

  addTheater(theater: Omit<Theater, 'id' | 'owner' | 'approvalStatus'>): Observable<Theater> {
    return this.http.post<any>('/theatres', theater).pipe(
      map((t) => this.mapTheater(t))
    );
  }

  updateTheater(id: string, theater: Partial<Theater>): Observable<Theater> {
    return this.http.put<any>(`/theatres/${id}`, theater).pipe(
      map((t) => this.mapTheater(t))
    );
  }

  deleteTheater(id: string): Observable<any> {
    return this.http.delete(`/theatres/${id}`);
  }

  approveTheater(id: string): Observable<Theater> {
    return this.http.patch<any>(`/theatres/${id}/approve`, {}).pipe(
      map((t) => this.mapTheater(t))
    );
  }

  rejectTheater(id: string): Observable<Theater> {
    return this.http.patch<any>(`/theatres/${id}/reject`, {}).pipe(
      map((t) => this.mapTheater(t))
    );
  }

  getTheaterById(id: string) {
    return this.http.get<any>(`/theatres/${id}`);
  }   
}
