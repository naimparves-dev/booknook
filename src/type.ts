export interface Book {
  _id?: string;
  id?: string | number;
  bookTitle: string;
  authorName: string;
  category: string;
  totalCopies: number;
  bookImage: string;
  description: string;
  username?: string;
  userEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BorrowRecord {
  _id?: string;
  id?: string | number;
  bookId: string;
  bookTitle: string;
  bookImage?: string;
  authorName?: string;
  category?: string;
  userName: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
  status?: string;
}