"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddAuthorForm } from "@/components/forms/add-author-form";
import { api } from "@/lib/api";

export default function ManageAuthorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [authorsList, setAuthorsList] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const authors = await api.authors.list();
      setAuthorsList(authors as any[]);
    } catch (error) {
      console.error("Failed to fetch authors:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAuthors = authorsList.filter(
    (author) =>
      author.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author.author_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAuthor = async (newAuthorData: any) => {
    try {
      const created = await api.authors.create(newAuthorData);
      setAuthorsList([...authorsList, created]);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to add author", error);
      alert("Failed to add author.");
    }
  };

  const handleEditAuthor = async (updatedAuthorData: any) => {
    if (!editingAuthor) return;
    try {
      const updated = await api.authors.update(editingAuthor.author_id.toString(), updatedAuthorData);
      setAuthorsList(
        authorsList.map((a) =>
          a.author_id === updated.author_id ? updated : a
        )
      );
      setEditingAuthor(null);
    } catch (error) {
      console.error("Failed to edit author", error);
      alert("Failed to edit author.");
    }
  };

  const handleDeleteAuthor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this author?")) return;
    try {
      await api.authors.delete(id);
      setAuthorsList(authorsList.filter((a) => a.author_id.toString() !== id));
    } catch (error) {
      console.error("Failed to delete author", error);
      alert("Failed to delete author. They might be linked to existing books.");
    }
  };

  if (loading) {
    return <div className="p-6">Loading authors...</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Authors</h1>
          <p className="text-muted-foreground">Add, edit, or remove authors from the system</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Add Author
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border bg-card sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">Add New Author</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Fill in the details to add a new author.
              </DialogDescription>
            </DialogHeader>
            <AddAuthorForm onSubmit={handleAddAuthor} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-card-foreground">Authors List</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-border bg-input pl-9 text-foreground placeholder:text-muted-foreground sm:w-72"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-muted-foreground">ID</TableHead>
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Email</TableHead>
                  <TableHead className="text-muted-foreground">Address</TableHead>
                  <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAuthors.map((author) => (
                  <TableRow key={author.author_id} className="border-border">
                    <TableCell className="font-medium text-foreground">{author.author_id}</TableCell>
                    <TableCell className="text-foreground">{author.author_name}</TableCell>
                    <TableCell className="text-muted-foreground">{author.author_email}</TableCell>
                    <TableCell className="text-muted-foreground">{author.address}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog
                          open={editingAuthor?.author_id === author.author_id}
                          onOpenChange={(open) => !open && setEditingAuthor(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingAuthor(author)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="border-border bg-card sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle className="text-card-foreground">Edit Author</DialogTitle>
                              <DialogDescription className="text-muted-foreground">
                                Update the author details.
                              </DialogDescription>
                            </DialogHeader>
                            {editingAuthor && (
                              <AddAuthorForm
                                onSubmit={handleEditAuthor}
                                onCancel={() => setEditingAuthor(null)}
                                initialData={editingAuthor}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAuthor(author.author_id.toString())}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredAuthors.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium text-foreground">No authors found</h3>
              <p className="mt-2 text-muted-foreground">Try adjusting your search</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
