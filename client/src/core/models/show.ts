export interface Show {
    id: string;
    movieId: string;
    movieTitle: string;
    theaterId: string;
    date: string;
    time: string;
    ticketPrice: number;
    bookedSeatsCount: number;
  }
  
  export interface ShowPayload {
    movie: string;
    theater: string;
    date: string;
    time: string;
    ticketPrice: number;
  }
  