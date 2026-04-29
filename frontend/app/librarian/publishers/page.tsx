"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Building } from "lucide-react";
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
import { AddPublisherForm } from "@/components/forms/add-publisher-form";
import { api } from "@/lib/api";

export default function ManagePublishersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [publishersList, setPublishersList] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublishers();
  }, []);

  const fetchPublishers = async () => {
    try {
      setLoading(true);
      const publishers = await api.publishers.list();
      setPublishersList(publishers as any[]);
    } catch (error) {
      console.error("Failed to fetch publishers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPublishers = publishersList.filter(
    (publisher) =>
      publisher.publisher_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      publisher.publisher_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPublisher = async (newPublisherData: any) => {
    try {
      const created = await api.publishers.create(newPublisherData);
      setPublishersList([...publishersList, created]);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to add publisher", error);
      alert("Failed to add publisher.");
    }
  };

  const handleEditPublisher = async (updatedPublisherData: any) => {
    if (!editingPublisher) return;
    try {
      const updated = await api.publishers.update(editingPublisher.publisher_id.toString(), updatedPublisherData);
      setPublishersList(
        publishersList.map((p) =>
          p.publisher_id === updated.publisher_id ? updated : p
        )
      );
      setEditingPublisher(null);
    } catch (error) {
      console.error("Failed to edit publisher", error);
      alert("Failed to edit publisher.");
    }
  };

  const handleDeletePublisher = async (id: string) => {
    if (!confirm("Are you sure you want to delete this publisher?")) return;
    try {
      await api.publishers.delete(id);
      setPublishersList(publishersList.filter((p) => p.publisher_id.toString() !== id));
    } catch (error) {
      console.error("Failed to delete publisher", error);
      alert("Failed to delete publisher. They might be linked to existing books.");
    }
  };

  if (loading) {
    return <div className="p-6">Loading publishers...</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Publishers</h1>
          <p className="text-muted-foreground">Add, edit, or remove publishers from the system</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Add Publisher
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border bg-card sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">Add New Publisher</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Fill in the details to add a new publisher.
              </DialogDescription>
            </DialogHeader>
            <AddPublisherForm onSubmit={handleAddPublisher} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-card-foreground">Publishers List</CardTitle>
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
                  <TableHead className="text-muted-foreground">Phone</TableHead>
                  <TableHead className="text-muted-foreground">Address</TableHead>
                  <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPublishers.map((publisher) => (
                  <TableRow key={publisher.publisher_id} className="border-border">
                    <TableCell className="font-medium text-foreground">{publisher.publisher_id}</TableCell>
                    <TableCell className="text-foreground">{publisher.publisher_name}</TableCell>
                    <TableCell className="text-muted-foreground">{publisher.publisher_email}</TableCell>
                    <TableCell className="text-muted-foreground">{publisher.publisher_phone}</TableCell>
                    <TableCell className="text-muted-foreground">{publisher.publisher_address}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog
                          open={editingPublisher?.publisher_id === publisher.publisher_id}
                          onOpenChange={(open) => !open && setEditingPublisher(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingPublisher(publisher)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="border-border bg-card sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle className="text-card-foreground">Edit Publisher</DialogTitle>
                              <DialogDescription className="text-muted-foreground">
                                Update the publisher details.
                              </DialogDescription>
                            </DialogHeader>
                            {editingPublisher && (
                              <AddPublisherForm
                                onSubmit={handleEditPublisher}
                                onCancel={() => setEditingPublisher(null)}
                                initialData={editingPublisher}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePublisher(publisher.publisher_id.toString())}
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
          {filteredPublishers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium text-foreground">No publishers found</h3>
              <p className="mt-2 text-muted-foreground">Try adjusting your search</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
