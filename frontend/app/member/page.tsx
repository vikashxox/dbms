"use client";

import { useState, useEffect } from "react";
import { Search, BookOpen, Clock, CheckCircle, ShoppingCart, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookCard } from "@/components/book-card";
import { api } from "@/lib/api";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

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

export default function MemberDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const [books, setBooks] = useState<any[]>([]);
  const [userBorrowedBooks, setUserBorrowedBooks] = useState<any[]>([]);
  const [allBorrows, setAllBorrows] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cart Dates
  const [cartIssueDate, setCartIssueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [cartDueDate, setCartDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });

  // Selected Borrowed Book Details
  const [selectedBorrow, setSelectedBorrow] = useState<any | null>(null);

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
      const [booksData, borrowsData] = await Promise.all([
        api.books.list(),
        api.borrows.list()
      ]);
      
      setBooks(booksData as any[]);
      setAllBorrows(borrowsData as any[]);

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

  // Determine if book is available
  const getMappedBooks = () => {
    return books.map((b) => {
      const isBorrowed = allBorrows.some(borrow => borrow.book_id === b.book_id && borrow.borrow_status === "issued");
      return {
        id: b.book_id.toString(),
        title: b.title,
        author: b.authors && b.authors.length > 0 ? b.authors.map((a: any) => a.author.author_name).join(", ") : "Unknown Author",
        category: b.category,
        available: !isBorrowed,
        coverColor: "bg-blue-500", // placeholder color
        ...b
      };
    });
  };

  const mappedBooks = getMappedBooks();
  
  const categories = ["All", ...Array.from(new Set(mappedBooks.map(b => b.category)))];

  const filteredBooks = mappedBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (bookId: string) => {
    const book = mappedBooks.find(b => b.id === bookId);
    if (book && !cart.find(c => c.id === bookId)) {
      setCart([...cart, book]);
    }
  };

  const removeFromCart = (bookId: string) => {
    setCart(cart.filter(c => c.id !== bookId));
  };

  const handleCheckout = async () => {
    if (!memberId || cart.length === 0) return;
    try {
      await Promise.all(cart.map(book => 
        api.borrows.create({
          member_id: memberId,
          book_id: book.book_id,
          issue_date: new Date(cartIssueDate).toISOString(),
          due_date: new Date(cartDueDate).toISOString()
        })
      ));
      
      await fetchData();
      setCart([]);
      alert("Books successfully borrowed!");
    } catch (error) {
      console.error("Checkout failed", error);
      alert("Failed to borrow some books. Please try again.");
    }
  };

  const calculateCurrentFine = (borrow: any) => {
    const dueDate = new Date(borrow.due_date);
    const now = new Date();
    if (now <= dueDate) return 0;
    
    const msPerDay = 24 * 60 * 60 * 1000;
    const lateDays = Math.ceil((now.getTime() - dueDate.getTime()) / msPerDay);
    const fineRate = 1; // 1 rupee per day
    return lateDays * fineRate;
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground">Browse and borrow books from our collection</p>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {cart.length}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Borrowing Cart</SheetTitle>
            </SheetHeader>
            <div className="mt-8 flex flex-col gap-4">
              {cart.length === 0 ? (
                <p className="text-muted-foreground">Your cart is empty.</p>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    {cart.map(book => (
                      <div key={book.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium text-sm">{book.title}</p>
                          <p className="text-xs text-muted-foreground">{book.author}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeFromCart(book.id)} className="text-destructive">Remove</Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-4 border-t pt-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="issueDate">Issue Date</Label>
                      <Input 
                        id="issueDate" 
                        type="date" 
                        value={cartIssueDate} 
                        onChange={(e) => setCartIssueDate(e.target.value)}
                        className="bg-input text-foreground border-border"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="dueDate">Return (Due) Date</Label>
                      <Input 
                        id="dueDate" 
                        type="date" 
                        value={cartDueDate} 
                        onChange={(e) => setCartDueDate(e.target.value)}
                        className="bg-input text-foreground border-border"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <SheetFooter className="mt-8">
                <SheetClose asChild>
                  <Button className="w-full" onClick={handleCheckout}>Confirm Borrow ({cart.length})</Button>
                </SheetClose>
              </SheetFooter>
            )}
          </SheetContent>
        </Sheet>
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
              {mappedBooks.filter((b) => b.available).length}
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
              {userBorrowedBooks.map((borrowed) => {
                const isOverdue = new Date(borrowed.due_date) < new Date();
                return (
                  <div
                    key={borrowed.borrow_id}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-secondary/50 p-4 transition-colors hover:bg-secondary/70"
                    onClick={() => setSelectedBorrow(borrowed)}
                  >
                    <div>
                      <h4 className="font-medium text-card-foreground">{borrowed.book?.title || "Unknown Book"}</h4>
                      <p className="text-sm text-muted-foreground">Due: {formatDate(borrowed.due_date)}</p>
                    </div>
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
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Borrow Details Dialog */}
      <Dialog open={!!selectedBorrow} onOpenChange={(open) => !open && setSelectedBorrow(null)}>
        <DialogContent className="border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">Borrow Details</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Information about your borrowed book.
            </DialogDescription>
          </DialogHeader>
          {selectedBorrow && (
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Book Title</span>
                <span className="font-medium text-foreground">{selectedBorrow.book?.title || "Unknown Book"}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3"/> Issue Date</span>
                  <span className="font-medium text-foreground">{formatDate(selectedBorrow.issue_date)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3"/> Return/Due Date</span>
                  <span className="font-medium text-foreground">{formatDate(selectedBorrow.due_date)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={new Date(selectedBorrow.due_date) < new Date() ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"}>
                    {new Date(selectedBorrow.due_date) < new Date() ? "OVERDUE" : "ISSUED"}
                  </Badge>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm text-muted-foreground">Estimated Fine</span>
                  <span className={`text-xl font-bold ${calculateCurrentFine(selectedBorrow) > 0 ? 'text-destructive' : 'text-primary'}`}>
                    ₹{calculateCurrentFine(selectedBorrow)}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
          <BookCard 
            key={book.id} 
            book={book} 
            onBorrow={handleAddToCart} 
            isInCart={cart.some(c => c.id === book.id)}
          />
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
