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
import { Member } from "@/lib/data";

interface AddMemberFormProps {
  onSubmit: (member: Omit<Member, "id">) => void;
  onCancel: () => void;
  initialData?: Member;
}

export function AddMemberForm({ onSubmit, onCancel, initialData }: AddMemberFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [joinDate, setJoinDate] = useState(initialData?.joinDate || new Date().toISOString().split("T")[0]);
  const [booksIssued, setBooksIssued] = useState(initialData?.booksIssued ?? 0);
  const [status, setStatus] = useState<"active" | "inactive">(initialData?.status || "active");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      email,
      joinDate,
      booksIssued,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name" className="text-foreground">
          Full Name
        </Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter full name"
          required
          className="border-border bg-input text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className="text-foreground">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
          required
          className="border-border bg-input text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="joinDate" className="text-foreground">
          Join Date
        </Label>
        <Input
          id="joinDate"
          type="date"
          value={joinDate}
          onChange={(e) => setJoinDate(e.target.value)}
          required
          className="border-border bg-input text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="booksIssued" className="text-foreground">
          Books Issued
        </Label>
        <Input
          id="booksIssued"
          type="number"
          min="0"
          value={booksIssued}
          onChange={(e) => setBooksIssued(parseInt(e.target.value) || 0)}
          className="border-border bg-input text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="status" className="text-foreground">
          Status
        </Label>
        <Select value={status} onValueChange={(v) => setStatus(v as "active" | "inactive")}>
          <SelectTrigger className="border-border bg-input text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-border bg-popover">
            <SelectItem value="active" className="text-popover-foreground">
              Active
            </SelectItem>
            <SelectItem value="inactive" className="text-popover-foreground">
              Inactive
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
          {initialData ? "Update Member" : "Add Member"}
        </Button>
      </div>
    </form>
  );
}
