export type BookCategory = 'Science' | 'Art' | 'Religion' | 'History' | 'Geography';

export interface Book {
  isbn: string;
  title: string;
  authors: string[];
  publisher: string;
  publicationYear: number;
  sellingPrice: number;
  category: BookCategory;
  quantity: number;
  threshold: number;
  imageUrl?: string;
}

export interface BookFormData {
  isbn: string;
  title: string;
  authors: string;
  publisher: string;
  publicationYear: number;
  sellingPrice: number;
  category: BookCategory;
  quantity: number;
  threshold: number;
}
