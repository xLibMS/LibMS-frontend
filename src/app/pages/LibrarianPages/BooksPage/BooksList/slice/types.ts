import { Book } from 'app/pages/LibrarianPages/AddBookPage/AddBookForm/slice/types';

export interface BooksState {
  books: Book[];
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
}
