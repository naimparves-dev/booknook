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