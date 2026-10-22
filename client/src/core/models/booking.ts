export interface BookingShowMovie {
  _id: string;
  title: string;
}

export interface BookingShowTheater {
  _id: string;
  name: string;
  address: string;
}

export interface BookingShow {
  _id: string;
  date: string;
  time: string;
  ticketPrice: number;
  movie: BookingShowMovie;
  theater: BookingShowTheater;
}

export interface Booking {
  _id: string;
  show: BookingShow;
  user: string;
  seats: string[];
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

