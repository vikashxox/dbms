"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddBookForm } from "@/components/forms/add-book-form";
import { api } from "@/lib/api";

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default function ManageBooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [booksList, setBooksList] = useState<any[]>([]);
  const [authorsList, setAuthorsList] = useState<any[]>([]);
  const [publishersList, setPublishersList] = useState<any[]>([]);
  const [allBorrows, setAllBorrows] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [librarianId, setLibrarianId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.id) setLibrarianId(parseInt(decoded.id, 10));
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [books, authors, publishers, borrows] = await Promise.all([
        api.books.list(),
        api.authors.list(),
        api.publishers.list(),
        api.borrows.list()
      ]);
      setBooksList(books as any[]);
      setAuthorsList(authors as any[]);
      setPublishersList(publishers as any[]);
      setAllBorrows(borrows as any[]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMappedBooks = () => {
    return booksList.map((b) => {
      const isBorrowed = allBorrows.some(borrow => borrow.book_id === b.book_id && borrow.borrow_status === "issued");
      return {
        id: b.book_id.toString(),
        title: b.title,
        author: b.authors && b.authors.length > 0 ? b.authors.map((a: any) => a.author.author_name).join(", ") : "Unknown Author",
        category: b.category,
        isbn: b.isbn,
        available: !isBorrowed,
        ...b
      };
    });
  };

  const mappedBooks = getMappedBooks();

  const filteredBooks = mappedBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery)
  );

  const handleAddBook = async (newBookData: any) => {
    try {
      const bookPayload = {
        ...newBookData,
        price: 0,
        edition: "1st",
        language: "English",
        shelf_location: "General",
        librarian_id: librarianId || 1 // fallback to 1
      };
      
      const created = await api.books.create(bookPayload);
      setBooksList([...booksList, created]);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to add book", error);
      alert("Failed to add book. Make sure Publisher and Author are selected.");
    }
  };

  const handleEditBook = async (updatedBookData: any) => {
    if (!editingBook) return;
    try {
      const updated = await api.books.update(editingBook.book_id.toString(), updatedBookData);
      setBooksList(
        booksList.map((b) =>
          b.book_id === updated.book_id ? updated : b
        )
      );
      setEditingBook(null);
    } catch (error) {
      console.error("Failed to edit book", error);
      alert("Failed to edit book.");
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await api.books.delete(id);
      setBooksList(booksList.filter((b) => b.book_id.toString() !== id));
    } catch (error) {
      console.error("Failed to delete book", error);
      alert("Failed to delete book. It might be currently borrowed.");
    }
  };

  if (loading) {
    return <div className="p-6">Loading books...</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Books</h1>
          <p className="text-muted-foreground">Add, edit, or remove books from the library</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Add Book
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border bg-card sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">Add New Book</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Fill in the details to add a new book to the library.
              </DialogDescription>
            </DialogHeader>
            <AddBookForm 
              onSubmit={handleAddBook} 
              onCancel={() => setIsAddDialogOpen(false)} 
              authorsList={authorsList}
              publishersList={publishersList}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{mappedBooks.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {mappedBooks.filter((b) => b.available).length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Borrowed</CardTitle>
            <BookOpen className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {mappedBooks.filter((b) => !b.available).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-card-foreground">Books List</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title, author, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-border bg-input pl-9 text-foreground placeholder:text-muted-foreground sm:w-72"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">Title</TableHead>
                  <TableHead className="text-muted-foreground">Author</TableHead>
                  <TableHead className="text-muted-foreground">Category</TableHead>
                  <TableHead className="text-muted-foreground">ISBN</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks.map((book) => (
                  <TableRow key={book.id} className="border-border">
                    <TableCell className="font-medium text-foreground">{book.title}</TableCell>
                    <TableCell className="text-muted-foreground">{book.author}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                        {book.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{book.isbn}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          book.available
                            ? "bg-primary/20 text-primary"
                            : "bg-destructive/20 text-destructive"
                        }
                      >
                        {book.available ? "Available" : "Borrowed"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog
                          open={editingBook?.book_id === book.book_id}
                          onOpenChange={(open) => !open && setEditingBook(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingBook(book)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="border-border bg-card sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle className="text-card-foreground">Edit Book</DialogTitle>
                              <DialogDescription className="text-muted-foreground">
                                Update the book details.
                              </DialogDescription>
                            </DialogHeader>
                            {editingBook && (
                              <AddBookForm
                                onSubmit={handleEditBook}
                                onCancel={() => setEditingBook(null)}
                                initialData={editingBook}
                                authorsList={authorsList}
                                publishersList={publishersList}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteBook(book.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredBooks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium text-foreground">No books found</h3>
              <p className="mt-2 text-muted-foreground">Try adjusting your search</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
