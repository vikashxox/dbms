"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, User, Bell, Shield, BookOpen, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"member" | "librarian" | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dueDateReminders, setDueDateReminders] = useState(true);

  // Common User Data
  const [email, setEmail] = useState("");
  
  // Member Specific Data
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState(1);
  const [address, setAddress] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([""]);

  // Librarian Specific Data
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [shiftTime, setShiftTime] = useState("");

  // Passwords
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      
      const decoded = parseJwt(token);
      if (decoded && decoded.id && decoded.role) {
        setUserId(decoded.id.toString());
        setRole(decoded.role);
        
        try {
          if (decoded.role === "member") {
            const data: any = await api.members.get(decoded.id.toString());
            setFirstName(data.first_name || "");
            setMiddleName(data.middle_name || "");
            setLastName(data.last_name || "");
            setEmail(data.email || "");
            setDepartment(data.department || "");
            setYear(data.year || 1);
            setAddress(data.address || "");
            
            if (data.phone) {
              setPhoneNumbers(data.phone.split(",").map((p: string) => p.trim()));
            }
          } else if (decoded.role === "librarian") {
            const data: any = await api.librarians.get(decoded.id.toString());
            setName(data.name || "");
            setEmail(data.email || "");
            setPhone(data.phone || "");
            setShiftTime(data.shift_time || "");
          }
        } catch (error) {
          console.error("Failed to fetch user data", error);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

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

  const handleSaveProfile = async () => {
    if (!userId || !role) return;

    try {
      if (role === "member") {
        const validPhones = phoneNumbers.filter(p => p.trim() !== "");
        if (validPhones.length === 0) {
          alert("At least one phone number is required.");
          return;
        }

        await api.members.update(userId, {
          first_name: firstName,
          middle_name: middleName || null,
          last_name: lastName,
          email,
          department,
          year,
          address,
          phone: validPhones.join(", ")
        });
      } else {
        await api.librarians.update(userId, {
          name,
          email,
          phone,
          shift_time: shiftTime
        });
      }
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Failed to update profile.");
    }
  };

  const handleUpdatePassword = async () => {
    if (!userId || !role) return;
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    if (!newPassword || !currentPassword) {
      alert("Please fill in both current and new passwords.");
      return;
    }

    try {
      if (role === "member") {
        await api.members.update(userId, { password: newPassword });
      } else {
        await api.librarians.update(userId, { password: newPassword });
      }
      alert("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to update password", error);
      alert("Failed to update password.");
    }
  };

  if (loading) {
    return <div className="min-h-screen p-6">Loading settings...</div>;
  }

  const backLink = role === "librarian" ? "/librarian" : "/member";

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl">
        <Link
          href={backLink}
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage your account preferences</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle className="text-card-foreground">Profile Information</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">
                Update your personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              
              {role === "member" && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-input text-foreground border-border" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input id="middleName" value={middleName} onChange={(e) => setMiddleName(e.target.value)} className="bg-input text-foreground border-border" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-input text-foreground border-border" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-input text-foreground border-border" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} className="bg-input text-foreground border-border" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="year">Student Year</Label>
                      <Input id="year" type="number" min="1" max="10" value={year} onChange={(e) => setYear(parseInt(e.target.value) || 1)} className="bg-input text-foreground border-border" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="bg-input text-foreground border-border" />
                  </div>

                  <div className="flex flex-col gap-2 border border-border rounded-lg p-3 bg-secondary/20 mt-2">
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
                          className="bg-input text-foreground border-border"
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
                </>
              )}

              {role === "librarian" && (
                <>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="lib-name">Full Name</Label>
                    <Input id="lib-name" value={name} onChange={(e) => setName(e.target.value)} className="bg-input text-foreground border-border" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="lib-email">Email</Label>
                    <Input id="lib-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-input text-foreground border-border" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="lib-phone">Phone</Label>
                    <Input id="lib-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-input text-foreground border-border" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="lib-shift">Shift Time</Label>
                    <Input id="lib-shift" value={shiftTime} onChange={(e) => setShiftTime(e.target.value)} className="bg-input text-foreground border-border" />
                  </div>
                </>
              )}

              <Button onClick={handleSaveProfile} className="mt-4 w-fit bg-primary text-primary-foreground hover:bg-primary/90">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-chart-3" />
                <CardTitle className="text-card-foreground">Notifications</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">
                Configure how you receive updates
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Due Date Reminders</p>
                  <p className="text-sm text-muted-foreground">Get notified before books are due</p>
                </div>
                <Switch checked={dueDateReminders} onCheckedChange={setDueDateReminders} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-chart-2" />
                <CardTitle className="text-card-foreground">Security</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="current-password">Current Password (Required)</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="border-border bg-input text-foreground"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border-border bg-input text-foreground"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-border bg-input text-foreground"
                />
              </div>
              <Button onClick={handleUpdatePassword} className="mt-2 w-fit bg-primary text-primary-foreground hover:bg-primary/90">
                Update Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
