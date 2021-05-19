import { User } from 'app/pages/CommonPages/UserProfilePage/slice/types';
import { Book } from 'app/pages/LibrarianPages/AddBookPage/AddBookForm/slice/types';

export interface Reservation {
  book: Book;
  reservationDate: string;
  user: User;
  reservationStatus: string;
}

export interface ReservationsState {
  reservations: Reservation[];
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
}