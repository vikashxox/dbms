"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddMemberFormProps {
  onSubmit: (member: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export function AddMemberForm({ onSubmit, onCancel, initialData }: AddMemberFormProps) {
  const [firstName, setFirstName] = useState(initialData?.first_name || "");
  const [middleName, setMiddleName] = useState(initialData?.middle_name || "");
  const [lastName, setLastName] = useState(initialData?.last_name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [department, setDepartment] = useState(initialData?.department || "");
  const [year, setYear] = useState<number>(initialData?.year || 1);
  const [address, setAddress] = useState(initialData?.address || "");
  const [status, setStatus] = useState<"active" | "inactive">(initialData?.status || "active");
  const [password, setPassword] = useState("");
  
  // Phone numbers array
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(() => {
    if (initialData?.phone) {
      return initialData.phone.split(",").map((p: string) => p.trim());
    }
    return [""];
  });

  const handleAddPhone = () => {
    setPhoneNumbers([...phoneNumbers, ""]);
  };

  const handleRemovePhone = (index: number) => {
    if (phoneNumbers.length > 1) {
      const updated = [...phoneNumbers];
      updated.splice(index, 1);
      setPhoneNumbers(updated);
    }
  };

  const handlePhoneChange = (index: number, value: string) => {
    const updated = [...phoneNumbers];
    updated[index] = value;
    setPhoneNumbers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Join phone numbers
    const validPhones = phoneNumbers.filter(p => p.trim() !== "");
    if (validPhones.length === 0) {
      alert("At least one phone number is required.");
      return;
    }
    
    const submitData: any = {
      first_name: firstName,
      middle_name: middleName || null,
      last_name: lastName,
      email,
      department,
      year,
      address,
      status,
      phone: validPhones.join(", ")
    };

    if (password) {
      submitData.password = password;
    }

    if (!initialData && !password) {
      alert("Password is required for new members.");
      return;
    }

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto px-1 pb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="firstName" className="text-foreground">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="border-border bg-input text-foreground"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="middleName" className="text-foreground">Middle Name (Optional)</Label>
          <Input
            id="middleName"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            className="border-border bg-input text-foreground"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="border-border bg-input text-foreground"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-foreground">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-border bg-input text-foreground"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="department" className="text-foreground">Department</Label>
          <Input
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
            className="border-border bg-input text-foreground"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="year" className="text-foreground">Student Year</Label>
          <Input
            id="year"
            type="number"
            min="1"
            max="10"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value) || 1)}
            required
            className="border-border bg-input text-foreground"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="address" className="text-foreground">Address</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="border-border bg-input text-foreground"
        />
      </div>

      <div className="flex flex-col gap-2 border border-border rounded-lg p-3 bg-secondary/20">
        <Label className="text-foreground flex items-center justify-between">
          Phone Numbers
          <Button type="button" variant="outline" size="sm" onClick={handleAddPhone} className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </Label>
        {phoneNumbers.map((phone, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={phone}
              onChange={(e) => handlePhoneChange(index, e.target.value)}
              placeholder="e.g. +91 98765 43210"
              required={index === 0}
              className="border-border bg-input text-foreground"
            />
            {phoneNumbers.length > 1 && (
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => handleRemovePhone(index)}
                className="text-destructive shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="status" className="text-foreground">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as "active" | "inactive")}>
            <SelectTrigger className="border-border bg-input text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-border bg-popover">
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password" className="text-foreground">
            {initialData ? "Change Password (Optional)" : "Password"}
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!initialData}
            placeholder={initialData ? "Leave blank to keep current" : "Create password"}
            className="border-border bg-input text-foreground"
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
          {initialData ? "Update Member" : "Add Member"}
        </Button>
      </div>
    </form>
  );
}
