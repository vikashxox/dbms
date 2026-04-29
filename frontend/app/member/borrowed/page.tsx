"use client";

import { useState, useEffect } from "react";
import { BookMarked, Calendar, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

// Utility to parse JWT token
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

// Utility to format dates as DD-MM-YYYY
function formatDate(dateString: string | Date) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export default function BorrowedBooksPage() {
  const [userBorrowedBooks, setUserBorrowedBooks] = useState<any[]>([]);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.id) setMemberId(decoded.id.toString());
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const borrowsData = await api.borrows.list();
      
      if (memberId) {
        const userBorrows = (borrowsData as any[]).filter((b: any) => 
          b.member_id.toString() === memberId && b.borrow_status !== "returned"
        );
        setUserBorrowedBooks(userBorrows);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (memberId !== null) {
      fetchData();
    }
  }, [memberId]);

  const handleReturnBook = async (borrowId: string) => {
    try {
      await api.borrows.return(borrowId);
      alert("Book returned successfully!");
      fetchData(); // Refresh the list
    } catch (error) {
      console.error("Failed to return book", error);
      alert("Failed to return the book.");
    }
  };

  if (loading) {
    return <div className="p-6">Loading borrowed books...</div>;
  }

  const overdueCount = userBorrowedBooks.filter((b) => new Date(b.due_date) < new Date()).length;

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
              {overdueCount}
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
                const book = borrowed.book;
                const isOverdue = new Date(borrowed.due_date) < new Date();
                
                return (
                  <div
                    key={borrowed.borrow_id}
                    className="flex flex-col gap-4 rounded-lg border border-border bg-secondary/30 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-12 items-center justify-center rounded-lg bg-blue-500">
                        <BookMarked className="h-6 w-6 text-white/80" />
                      </div>
                      <div>
                        <h4 className="font-medium text-card-foreground">{book?.title || "Unknown Book"}</h4>
                        <p className="text-sm text-muted-foreground">Category: {book?.category || "Unknown"}</p>
                        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Due: {formatDate(borrowed.due_date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={isOverdue ? "destructive" : "default"}
                        className={
                          isOverdue
                            ? "bg-destructive/20 text-destructive"
                            : "bg-primary/20 text-primary"
                        }
                      >
                        {isOverdue ? "Overdue" : "Issued"}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-border text-foreground hover:bg-primary hover:text-primary-foreground"
                        onClick={() => handleReturnBook(borrowed.borrow_id.toString())}
                      >
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
