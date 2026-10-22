export interface Show {
  id: string;
  movieId: string;
  movieTitle: string;
  theaterId: string;
  theaterName: string;
  theaterAddress: string;
  date: string;
  time: string;
  ticketPrice: number;
  bookedSeatsCount: number;
}

export interface TheaterShow {
  theaterId: string;
  theaterName: string;
  theaterAddress: string;
  shows: Show[];
}

export interface ShowPayload {
  movie: string;
  theater: string;
  date: string;
  time: string;
  ticketPrice: number;
}
