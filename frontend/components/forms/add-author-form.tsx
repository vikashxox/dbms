"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddAuthorFormProps {
  onSubmit: (author: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function AddAuthorForm({ onSubmit, onCancel, initialData }: AddAuthorFormProps) {
  const [authorName, setAuthorName] = useState(initialData?.author_name || "");
  const [authorEmail, setAuthorEmail] = useState(initialData?.author_email || "");
  const [address, setAddress] = useState(initialData?.address || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      author_name: authorName,
      author_email: authorEmail,
      address,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="author_name" className="text-foreground">
          Author Name
        </Label>
        <Input
          id="author_name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Enter author's full name"
          required
          className="border-border bg-input text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="author_email" className="text-foreground">
          Author Email
        </Label>
        <Input
          id="author_email"
          type="email"
          value={authorEmail}
          onChange={(e) => setAuthorEmail(e.target.value)}
          placeholder="author@example.com"
          required
          className="border-border bg-input text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="address" className="text-foreground">
          Address
        </Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter full address"
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
          {initialData ? "Update Author" : "Add Author"}
        </Button>
      </div>
    </form>
  );
}
