export interface Movie {
  id?: string;
  title: string;
  poster: string;       
  description: string;
  duration: number;
  genre: string;
  date: string | Date;  
}
