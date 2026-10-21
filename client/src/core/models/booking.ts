export interface Booking {
    id?: string;
    userId?: string;
    movieId?: string;
    seats?: string[];
    totalPrice?: number;
    bookingDate?: string;
  }