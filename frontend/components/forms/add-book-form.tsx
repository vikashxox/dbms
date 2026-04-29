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

export const categories = [
  "All",
  "Fiction",
  "Non-Fiction",
  "Science",
  "History",
  "Technology",
  "Literature",
];

interface AddBookFormProps {
  onSubmit: (book: any) => void;
  onCancel: () => void;
  initialData?: any;
  authorsList?: any[];
  publishersList?: any[];
}

export function AddBookForm({ onSubmit, onCancel, initialData, authorsList = [], publishersList = [] }: AddBookFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [authorId, setAuthorId] = useState(
    initialData?.authors && initialData.authors.length > 0 
      ? initialData.authors[0].author_id.toString() 
      : ""
  );
  const [publisherId, setPublisherId] = useState(
    initialData?.publisher_id ? initialData.publisher_id.toString() : ""
  );
  const [category, setCategory] = useState(initialData?.category || "");
  const [isbn, setIsbn] = useState(initialData?.isbn || "");
  const [available, setAvailable] = useState(initialData?.available ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      authorIds: authorId ? [parseInt(authorId, 10)] : [],
      publisher_id: publisherId ? parseInt(publisherId, 10) : undefined,
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
        <Select value={authorId} onValueChange={setAuthorId}>
          <SelectTrigger className="border-border bg-input text-foreground">
            <SelectValue placeholder="Select author" />
          </SelectTrigger>
          <SelectContent className="border-border bg-popover">
            {authorsList.map((a) => (
              <SelectItem key={a.author_id} value={a.author_id.toString()} className="text-popover-foreground">
                {a.author_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="publisher" className="text-foreground">
          Publisher
        </Label>
        <Select value={publisherId} onValueChange={setPublisherId}>
          <SelectTrigger className="border-border bg-input text-foreground">
            <SelectValue placeholder="Select publisher" />
          </SelectTrigger>
          <SelectContent className="border-border bg-popover">
            {publishersList.map((p) => (
              <SelectItem key={p.publisher_id} value={p.publisher_id.toString()} className="text-popover-foreground">
                {p.publisher_name}
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
