"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, Bell, Shield, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dueDateReminders, setDueDateReminders] = useState(true);
  const [newBookAlerts, setNewBookAlerts] = useState(false);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
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
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-foreground">
                  Full Name
                </Label>
                <Input
                  id="name"
                  defaultValue="John Smith"
                  className="border-border bg-input text-foreground"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="john.smith@email.com"
                  className="border-border bg-input text-foreground"
                />
              </div>
              <Button className="mt-2 w-fit bg-primary text-primary-foreground hover:bg-primary/90">
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">New Book Alerts</p>
                  <p className="text-sm text-muted-foreground">Know when new books are added</p>
                </div>
                <Switch checked={newBookAlerts} onCheckedChange={setNewBookAlerts} />
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
                <Label htmlFor="current-password" className="text-foreground">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  className="border-border bg-input text-foreground"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="new-password" className="text-foreground">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  className="border-border bg-input text-foreground"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirm-password" className="text-foreground">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  className="border-border bg-input text-foreground"
                />
              </div>
              <Button className="mt-2 w-fit bg-primary text-primary-foreground hover:bg-primary/90">
                Update Password
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
