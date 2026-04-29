"use client";

import { useState } from "react";
import { Search, BookOpen, Clock, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookCard } from "@/components/book-card";
import { books, categories, borrowedBooks } from "@/lib/data";

export default function MemberDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const userBorrowedBooks = borrowedBooks.filter((b) => b.memberId === "1");

  const handleBorrow = (bookId: string) => {
    console.log("[v0] Borrowing book:", bookId);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, John</h1>
        <p className="text-muted-foreground">Browse and borrow books from our collection</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{books.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Currently Borrowed</CardTitle>
            <Clock className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{userBorrowedBooks.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {books.filter((b) => b.available).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {userBorrowedBooks.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Your Borrowed Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {userBorrowedBooks.map((borrowed) => (
                <div
                  key={borrowed.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-4"
                >
                  <div>
                    <h4 className="font-medium text-card-foreground">{borrowed.bookTitle}</h4>
                    <p className="text-sm text-muted-foreground">Due: {borrowed.dueDate}</p>
                  </div>
                  <Badge
                    variant={borrowed.isOverdue ? "destructive" : "default"}
                    className={
                      borrowed.isOverdue
                        ? "bg-destructive/20 text-destructive"
                        : "bg-primary/20 text-primary"
                    }
                  >
                    {borrowed.isOverdue ? "Overdue" : "On Time"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-foreground">Browse Books</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-border bg-input pl-9 text-foreground placeholder:text-muted-foreground sm:w-64"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full border-border bg-input text-foreground sm:w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="border-border bg-popover">
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="text-popover-foreground">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} onBorrow={handleBorrow} />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium text-foreground">No books found</h3>
          <p className="mt-2 text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
