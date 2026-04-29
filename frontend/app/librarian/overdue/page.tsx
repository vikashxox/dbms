"use client";

import { AlertTriangle, Calendar, Mail, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { borrowedBooks, members } from "@/lib/data";

export default function OverdueBooksPage() {
  const overdueBooks = borrowedBooks.filter((b) => b.isOverdue);

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Overdue Books</h1>
        <p className="text-muted-foreground">Track and manage overdue book returns</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{overdueBooks.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Longest Overdue</CardTitle>
            <Calendar className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {overdueBooks.length > 0
                ? Math.max(...overdueBooks.map((b) => getDaysOverdue(b.dueDate)))
                : 0}{" "}
              days
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Members Affected</CardTitle>
            <Mail className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {new Set(overdueBooks.map((b) => b.memberId)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Overdue Items</CardTitle>
        </CardHeader>
        <CardContent>
          {overdueBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium text-foreground">No overdue books</h3>
              <p className="mt-2 text-muted-foreground">All books have been returned on time</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Book Title</TableHead>
                    <TableHead className="text-muted-foreground">Member</TableHead>
                    <TableHead className="text-muted-foreground">Email</TableHead>
                    <TableHead className="text-muted-foreground">Borrow Date</TableHead>
                    <TableHead className="text-muted-foreground">Due Date</TableHead>
                    <TableHead className="text-muted-foreground">Days Overdue</TableHead>
                    <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overdueBooks.map((item) => {
                    const member = members.find((m) => m.id === item.memberId);
                    const daysOverdue = getDaysOverdue(item.dueDate);
                    return (
                      <TableRow key={item.id} className="border-border">
                        <TableCell className="font-medium text-foreground">{item.bookTitle}</TableCell>
                        <TableCell className="text-muted-foreground">{item.memberName}</TableCell>
                        <TableCell className="text-muted-foreground">{member?.email}</TableCell>
                        <TableCell className="text-muted-foreground">{item.borrowDate}</TableCell>
                        <TableCell className="text-muted-foreground">{item.dueDate}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              daysOverdue > 7
                                ? "bg-destructive/20 text-destructive"
                                : "bg-chart-3/20 text-chart-3"
                            }
                          >
                            {daysOverdue} days
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-border text-foreground"
                            >
                              <Mail className="mr-1 h-3 w-3" /> Notify
                            </Button>
                            <Button
                              size="sm"
                              className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                              Mark Returned
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
