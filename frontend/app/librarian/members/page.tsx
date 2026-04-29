"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Users, UserCheck, UserX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { AddMemberForm } from "@/components/forms/add-member-form";
import { api } from "@/lib/api";

// Utility to format dates as DD-MM-YYYY
function formatDate(dateString: string | Date) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export default function ManageMembersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [membersList, setMembersList] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await api.members.list();
      setMembersList(data as any[]);
    } catch (error) {
      console.error("Failed to fetch members", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = membersList.filter(
    (member) =>
      `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMember = async (newMember: any) => {
    try {
      await api.members.create(newMember);
      await fetchMembers();
      setIsAddDialogOpen(false);
      alert("Member added successfully!");
    } catch (error) {
      console.error("Failed to add member", error);
      alert("Failed to add member.");
    }
  };

  const handleEditMember = async (updatedMember: any) => {
    if (!editingMember) return;
    try {
      await api.members.update(editingMember.member_id.toString(), updatedMember);
      await fetchMembers();
      setEditingMember(null);
      alert("Member updated successfully!");
    } catch (error) {
      console.error("Failed to update member", error);
      alert("Failed to update member.");
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      await api.members.delete(id);
      await fetchMembers();
    } catch (error) {
      console.error("Failed to delete member", error);
      alert("Failed to delete member.");
    }
  };

  if (loading) {
    return <div className="p-6">Loading members...</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Members</h1>
          <p className="text-muted-foreground">View and manage library members</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="border-border bg-card sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-card-foreground">Add New Member</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Fill in the details to register a new library member.
              </DialogDescription>
            </DialogHeader>
            <AddMemberForm onSubmit={handleAddMember} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Members</CardTitle>
            <Users className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{membersList.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {membersList.filter((m) => m.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inactive</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {membersList.filter((m) => m.status === "inactive").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-card-foreground">Members List</CardTitle>
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
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Email</TableHead>
                  <TableHead className="text-muted-foreground">Dept & Year</TableHead>
                  <TableHead className="text-muted-foreground">Phone</TableHead>
                  <TableHead className="text-muted-foreground">Join Date</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.member_id} className="border-border">
                    <TableCell className="font-medium text-foreground">
                      {member.first_name} {member.middle_name ? member.middle_name + " " : ""}{member.last_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{member.email}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.department} (Year {member.year})
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-[150px] truncate" title={member.phone}>
                      {member.phone}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(member.join_date)}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          member.status === "active"
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog
                          open={editingMember?.member_id === member.member_id}
                          onOpenChange={(open) => !open && setEditingMember(null)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingMember(member)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="border-border bg-card sm:max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-card-foreground">Edit Member</DialogTitle>
                              <DialogDescription className="text-muted-foreground">
                                Update the member details.
                              </DialogDescription>
                            </DialogHeader>
                            {editingMember && (
                              <AddMemberForm
                                onSubmit={handleEditMember}
                                onCancel={() => setEditingMember(null)}
                                initialData={editingMember}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMember(member.member_id.toString())}
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
          {filteredMembers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium text-foreground">No members found</h3>
              <p className="mt-2 text-muted-foreground">Try adjusting your search</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
