"use client";

import { Book } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

interface BookCardProps {
  book: Book;
  onBorrow?: (bookId: string) => void;
  showBorrowButton?: boolean;
  isInCart?: boolean;
}

export function BookCard({ book, onBorrow, showBorrowButton = true, isInCart = false }: BookCardProps) {
  return (
    <Card className="overflow-hidden border-border bg-card transition-all hover:border-muted-foreground">
      <div className={`flex h-32 items-center justify-center ${book.coverColor}`}>
        <BookOpen className="h-12 w-12 text-white/80" />
      </div>
      <CardContent className="p-4">
        <h3 className="line-clamp-1 font-semibold text-card-foreground">{book.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{book.author}</p>
        <div className="mt-3 flex items-center gap-2">
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
            {book.category}
          </Badge>
          <Badge
            variant={book.available ? "default" : "destructive"}
            className={book.available ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"}
          >
            {book.available ? "Available" : "Issued"}
          </Badge>
        </div>
      </CardContent>
      {showBorrowButton && (
        <CardFooter className="border-t border-border p-4">
          <Button
            onClick={() => onBorrow?.(book.id)}
            disabled={!book.available || isInCart}
            variant={isInCart ? "secondary" : "default"}
            className={`w-full ${!isInCart ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""} disabled:opacity-50`}
          >
            {!book.available ? "Not Available" : isInCart ? "In Cart" : "Add to Cart"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
