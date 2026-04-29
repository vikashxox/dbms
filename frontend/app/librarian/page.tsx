"use client";

import { BookOpen, Users, BookMarked, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { books, members, borrowedBooks } from "@/lib/data";

export default function LibrarianDashboard() {
  const totalBooks = books.length;
  const totalMembers = members.length;
  const totalBorrowed = borrowedBooks.length;
  const overdueBooks = borrowedBooks.filter((b) => b.isOverdue);
  const availableBooks = books.filter((b) => b.available).length;
  const activeMembers = members.filter((m) => m.status === "active").length;

  const recentActivity = [
    { action: "Book Borrowed", detail: "The Great Gatsby by John Smith", time: "2 hours ago", type: "borrow" },
    { action: "New Member", detail: "Sarah Davis joined", time: "5 hours ago", type: "member" },
    { action: "Book Returned", detail: "Clean Code by Emily Johnson", time: "1 day ago", type: "return" },
    { action: "Overdue Notice", detail: "To Kill a Mockingbird - John Smith", time: "2 days ago", type: "overdue" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your library management system</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{totalBooks}</div>
            <p className="text-xs text-muted-foreground">{availableBooks} available</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Members</CardTitle>
            <Users className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{totalMembers}</div>
            <p className="text-xs text-muted-foreground">{activeMembers} active</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Books Borrowed</CardTitle>
            <BookMarked className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{totalBorrowed}</div>
            <div className="flex items-center text-xs text-primary">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12% this month
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{overdueBooks.length}</div>
            <p className="text-xs text-destructive">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-card-foreground">Overdue Books</CardTitle>
            <Link href="/librarian/overdue">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {overdueBooks.length === 0 ? (
              <p className="text-center text-muted-foreground">No overdue books</p>
            ) : (
              <div className="flex flex-col gap-3">
                {overdueBooks.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                  >
                    <div>
                      <p className="font-medium text-card-foreground">{item.bookTitle}</p>
                      <p className="text-sm text-muted-foreground">{item.memberName}</p>
                    </div>
                    <Badge className="bg-destructive/20 text-destructive">Due: {item.dueDate}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                >
                  <div>
                    <p className="font-medium text-card-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/librarian/books">
          <Card className="cursor-pointer border-border bg-card transition-all hover:border-primary">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Manage Books</h3>
                <p className="text-sm text-muted-foreground">Add, edit, or remove books</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/librarian/members">
          <Card className="cursor-pointer border-border bg-card transition-all hover:border-primary">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/20">
                <Users className="h-6 w-6 text-chart-2" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Manage Members</h3>
                <p className="text-sm text-muted-foreground">View and manage members</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/librarian/overdue">
          <Card className="cursor-pointer border-border bg-card transition-all hover:border-primary">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/20">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Overdue Books</h3>
                <p className="text-sm text-muted-foreground">Track overdue items</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/librarian/authors">
          <Card className="cursor-pointer border-border bg-card transition-all hover:border-primary">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/20">
                <Users className="h-6 w-6 text-indigo-500" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Manage Authors</h3>
                <p className="text-sm text-muted-foreground">Add, edit, or remove authors</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/librarian/publishers">
          <Card className="cursor-pointer border-border bg-card transition-all hover:border-primary">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/20">
                <BookOpen className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Manage Publishers</h3>
                <p className="text-sm text-muted-foreground">Add, edit, or remove publishers</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
