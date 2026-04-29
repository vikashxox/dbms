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
  
  // New Schema Fields
  const [edition, setEdition] = useState(initialData?.edition || "1st Edition");
  const [language, setLanguage] = useState(initialData?.language || "English");
  const [price, setPrice] = useState<number>(initialData?.price || 0);
  const [shelfLocation, setShelfLocation] = useState(initialData?.shelf_location || "A1");

  const [available, setAvailable] = useState(initialData?.available ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      authorIds: authorId ? [parseInt(authorId, 10)] : [],
      publisher_id: publisherId ? parseInt(publisherId, 10) : undefined,
      category,
      isbn,
      edition,
      language,
      price,
      shelf_location: shelfLocation,
      available,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto px-1 pb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <Label htmlFor="author" className="text-foreground">
            Author
          </Label>
          <Select value={authorId} onValueChange={setAuthorId}>
            <SelectTrigger className="border-border bg-input text-foreground">
              <SelectValue placeholder="Select author" />
            </SelectTrigger>
            <SelectContent className="border-border bg-popover max-h-48">
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
            <SelectContent className="border-border bg-popover max-h-48">
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
          <Label htmlFor="edition" className="text-foreground">
            Edition
          </Label>
          <Input
            id="edition"
            value={edition}
            onChange={(e) => setEdition(e.target.value)}
            placeholder="e.g. 1st Edition"
            required
            className="border-border bg-input text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="language" className="text-foreground">
            Language
          </Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="border-border bg-input text-foreground">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="border-border bg-popover">
              <SelectItem value="English" className="text-popover-foreground">English</SelectItem>
              <SelectItem value="Spanish" className="text-popover-foreground">Spanish</SelectItem>
              <SelectItem value="French" className="text-popover-foreground">French</SelectItem>
              <SelectItem value="German" className="text-popover-foreground">German</SelectItem>
              <SelectItem value="Chinese" className="text-popover-foreground">Chinese</SelectItem>
              <SelectItem value="Japanese" className="text-popover-foreground">Japanese</SelectItem>
              <SelectItem value="Hindi" className="text-popover-foreground">Hindi</SelectItem>
              <SelectItem value="Arabic" className="text-popover-foreground">Arabic</SelectItem>
              <SelectItem value="Russian" className="text-popover-foreground">Russian</SelectItem>
              <SelectItem value="Portuguese" className="text-popover-foreground">Portuguese</SelectItem>
              <SelectItem value="Italian" className="text-popover-foreground">Italian</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="price" className="text-foreground">
            Price (₹)
          </Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            required
            className="border-border bg-input text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="shelfLocation" className="text-foreground">
            Shelf Location
          </Label>
          <Input
            id="shelfLocation"
            value={shelfLocation}
            onChange={(e) => setShelfLocation(e.target.value)}
            placeholder="e.g. A1-Rack2"
            required
            className="border-border bg-input text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border mt-2">
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
