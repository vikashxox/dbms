"use client";

import { BookMarked, Calendar, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { borrowedBooks, books } from "@/lib/data";

export default function BorrowedBooksPage() {
  const userBorrowedBooks = borrowedBooks.filter((b) => b.memberId === "1");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Borrowed Books</h1>
        <p className="text-muted-foreground">Manage your currently borrowed books</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Currently Borrowed</CardTitle>
            <BookMarked className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{userBorrowedBooks.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {userBorrowedBooks.filter((b) => b.isOverdue).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Your Books</CardTitle>
        </CardHeader>
        <CardContent>
          {userBorrowedBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookMarked className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium text-foreground">No borrowed books</h3>
              <p className="mt-2 text-muted-foreground">Browse our collection and borrow some books</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {userBorrowedBooks.map((borrowed) => {
                const book = books.find((b) => b.id === borrowed.bookId);
                return (
                  <div
                    key={borrowed.id}
                    className="flex flex-col gap-4 rounded-lg border border-border bg-secondary/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-16 w-12 items-center justify-center rounded-lg ${book?.coverColor || "bg-muted"}`}
                      >
                        <BookMarked className="h-6 w-6 text-white/80" />
                      </div>
                      <div>
                        <h4 className="font-medium text-card-foreground">{borrowed.bookTitle}</h4>
                        <p className="text-sm text-muted-foreground">{book?.author}</p>
                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {borrowed.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
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
                      <Button variant="outline" size="sm" className="border-border text-foreground">
                        Return
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
