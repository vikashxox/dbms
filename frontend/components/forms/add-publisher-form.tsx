"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddPublisherFormProps {
  onSubmit: (publisher: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function AddPublisherForm({ onSubmit, onCancel, initialData }: AddPublisherFormProps) {
  const [publisherName, setPublisherName] = useState(initialData?.publisher_name || "");
  const [publisherEmail, setPublisherEmail] = useState(initialData?.publisher_email || "");
  const [publisherPhone, setPublisherPhone] = useState(initialData?.publisher_phone || "");
  const [publisherAddress, setPublisherAddress] = useState(initialData?.publisher_address || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      publisher_name: publisherName,
      publisher_email: publisherEmail,
      publisher_phone: publisherPhone,
      publisher_address: publisherAddress,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="publisher_name" className="text-foreground">
          Publisher Name
        </Label>
        <Input
          id="publisher_name"
          value={publisherName}
          onChange={(e) => setPublisherName(e.target.value)}
          placeholder="Enter publisher's name"
          required
          className="border-border bg-input text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="publisher_email" className="text-foreground">
          Publisher Email
        </Label>
        <Input
          id="publisher_email"
          type="email"
          value={publisherEmail}
          onChange={(e) => setPublisherEmail(e.target.value)}
          placeholder="contact@publisher.com"
          required
          className="border-border bg-input text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="publisher_phone" className="text-foreground">
          Publisher Phone
        </Label>
        <Input
          id="publisher_phone"
          value={publisherPhone}
          onChange={(e) => setPublisherPhone(e.target.value)}
          placeholder="Phone Number"
          required
          className="border-border bg-input text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="publisher_address" className="text-foreground">
          Publisher Address
        </Label>
        <Input
          id="publisher_address"
          value={publisherAddress}
          onChange={(e) => setPublisherAddress(e.target.value)}
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
          {initialData ? "Update Publisher" : "Add Publisher"}
        </Button>
      </div>
    </form>
  );
}
