"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book, categories, authors, publishers } from "@/lib/data";

interface AddBookFormProps {
  onSubmit: (book: Omit<Book, "id" | "coverColor">) => void;
  onCancel: () => void;
  initialData?: Book;
}

export function AddBookForm({ onSubmit, onCancel, initialData }: AddBookFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [author, setAuthor] = useState(initialData?.author || "");
  const [publisher, setPublisher] = useState(initialData?.publisher || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [isbn, setIsbn] = useState(initialData?.isbn || "");
  const [available, setAvailable] = useState(initialData?.available ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      author,
      publisher,
      category,
      isbn,
      available,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="title" className="text-foreground">
          Book Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter book title"
          required
          className="border-border bg-input text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="author" className="text-foreground">
          Author
        </Label>
        <Select value={author} onValueChange={setAuthor}>
          <SelectTrigger className="border-border bg-input text-foreground">
            <SelectValue placeholder="Select author" />
          </SelectTrigger>
          <SelectContent className="border-border bg-popover">
            {authors.map((a) => (
              <SelectItem key={a} value={a} className="text-popover-foreground">
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="publisher" className="text-foreground">
          Publisher
        </Label>
        <Select value={publisher} onValueChange={setPublisher}>
          <SelectTrigger className="border-border bg-input text-foreground">
            <SelectValue placeholder="Select publisher" />
          </SelectTrigger>
          <SelectContent className="border-border bg-popover">
            {publishers.map((p) => (
              <SelectItem key={p} value={p} className="text-popover-foreground">
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="category" className="text-foreground">
          Category
        </Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="border-border bg-input text-foreground">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="border-border bg-popover">
            {categories.filter((c) => c !== "All").map((c) => (
              <SelectItem key={c} value={c} className="text-popover-foreground">
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="isbn" className="text-foreground">
          ISBN
        </Label>
        <Input
          id="isbn"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          placeholder="978-0000000000"
          required
          className="border-border bg-input text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="status" className="text-foreground">
          Availability Status
        </Label>
        <Select value={available ? "available" : "borrowed"} onValueChange={(v) => setAvailable(v === "available")}>
          <SelectTrigger className="border-border bg-input text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-border bg-popover">
            <SelectItem value="available" className="text-popover-foreground">
              Available
            </SelectItem>
            <SelectItem value="borrowed" className="text-popover-foreground">
              Borrowed
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-border text-foreground"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
          {initialData ? "Update Book" : "Add Book"}
        </Button>
      </div>
    </form>
  );
}
