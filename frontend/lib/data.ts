export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  isbn: string;
  available: boolean;
  coverColor: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  booksIssued: number;
  status: "active" | "inactive";
}

export interface BorrowedBook {
  id: string;
  bookId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  borrowDate: string;
  dueDate: string;
  isOverdue: boolean;
}

export const books: Book[] = [
  { id: "1", title: "The Great Gatsby", author: "F. Scott Fitzgerald", publisher: "Scribner", category: "Fiction", isbn: "978-0743273565", available: true, coverColor: "bg-emerald-600" },
  { id: "2", title: "To Kill a Mockingbird", author: "Harper Lee", publisher: "J.B. Lippincott", category: "Fiction", isbn: "978-0061120084", available: false, coverColor: "bg-blue-600" },
  { id: "3", title: "1984", author: "George Orwell", publisher: "Secker & Warburg", category: "Dystopian", isbn: "978-0451524935", available: true, coverColor: "bg-red-600" },
  { id: "4", title: "Pride and Prejudice", author: "Jane Austen", publisher: "T. Egerton", category: "Romance", isbn: "978-0141439518", available: true, coverColor: "bg-pink-600" },
  { id: "5", title: "The Catcher in the Rye", author: "J.D. Salinger", publisher: "Little, Brown", category: "Fiction", isbn: "978-0316769488", available: false, coverColor: "bg-yellow-600" },
  { id: "6", title: "Clean Code", author: "Robert C. Martin", publisher: "Prentice Hall", category: "Technology", isbn: "978-0132350884", available: true, coverColor: "bg-cyan-600" },
  { id: "7", title: "The Pragmatic Programmer", author: "David Thomas", publisher: "Addison-Wesley", category: "Technology", isbn: "978-0135957059", available: true, coverColor: "bg-orange-600" },
  { id: "8", title: "Sapiens", author: "Yuval Noah Harari", publisher: "Harper", category: "History", isbn: "978-0062316097", available: false, coverColor: "bg-indigo-600" },
  { id: "9", title: "Atomic Habits", author: "James Clear", publisher: "Avery", category: "Self-Help", isbn: "978-0735211292", available: true, coverColor: "bg-teal-600" },
  { id: "10", title: "The Alchemist", author: "Paulo Coelho", publisher: "HarperOne", category: "Fiction", isbn: "978-0062315007", available: true, coverColor: "bg-amber-600" },
];

export const members: Member[] = [
  { id: "1", name: "John Smith", email: "john.smith@email.com", joinDate: "2024-01-15", booksIssued: 2, status: "active" },
  { id: "2", name: "Emily Johnson", email: "emily.j@email.com", joinDate: "2024-02-20", booksIssued: 1, status: "active" },
  { id: "3", name: "Michael Brown", email: "m.brown@email.com", joinDate: "2024-03-10", booksIssued: 3, status: "active" },
  { id: "4", name: "Sarah Davis", email: "sarah.d@email.com", joinDate: "2024-01-05", booksIssued: 0, status: "inactive" },
  { id: "5", name: "David Wilson", email: "d.wilson@email.com", joinDate: "2024-04-01", booksIssued: 1, status: "active" },
  { id: "6", name: "Jessica Martinez", email: "j.martinez@email.com", joinDate: "2024-02-28", booksIssued: 2, status: "active" },
];

export const borrowedBooks: BorrowedBook[] = [
  { id: "1", bookId: "2", bookTitle: "To Kill a Mockingbird", memberId: "1", memberName: "John Smith", borrowDate: "2024-04-01", dueDate: "2024-04-15", isOverdue: true },
  { id: "2", bookId: "5", bookTitle: "The Catcher in the Rye", memberId: "3", memberName: "Michael Brown", borrowDate: "2024-04-10", dueDate: "2024-04-24", isOverdue: true },
  { id: "3", bookId: "8", bookTitle: "Sapiens", memberId: "2", memberName: "Emily Johnson", borrowDate: "2024-04-20", dueDate: "2024-05-04", isOverdue: false },
];

export const categories = ["All", "Fiction", "Dystopian", "Romance", "Technology", "History", "Self-Help"];

export const authors = [
  "F. Scott Fitzgerald",
  "Harper Lee",
  "George Orwell",
  "Jane Austen",
  "J.D. Salinger",
  "Robert C. Martin",
  "David Thomas",
  "Yuval Noah Harari",
  "James Clear",
  "Paulo Coelho",
];

export const publishers = [
  "Scribner",
  "J.B. Lippincott",
  "Secker & Warburg",
  "T. Egerton",
  "Little, Brown",
  "Prentice Hall",
  "Addison-Wesley",
  "Harper",
  "Avery",
  "HarperOne",
];
