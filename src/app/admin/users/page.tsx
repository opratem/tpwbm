"use client";

import { AdminLayout } from "@/components/admin/admin-layout";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Download,
  Mail,
  Phone,
  Calendar,
  Eye,
  Settings,
  UserPlus,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import {
  getMinistryRoleOptions,
  getMinistryLevelOptions,
  MINISTRY_ROLES,
  type MinistryRole,
  type MinistryLevel
} from "@/lib/ministry";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member" | "visitor";
  ministryRole?: string | null;
  ministryLevel?: string | null;
  ministryDescription?: string | null;
  isActive: boolean;
  membershipDate: string | null;
  createdAt: string;
  phone: string | null;
}

interface UserFilters {
  search: string;
  role: string;
  ministryLevel: string;
  status: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

// Helper function to safely get user initials
const getUserInitials = (name: string | null | undefined): string => {
  if (!name || typeof name !== 'string' || name.trim() === '') return 'U';
  try {
    const words = name.trim().split(' ').filter(word => word.length > 0);
    if (words.length === 0) return 'U';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return words.map(n => n[0]).join('').toUpperCase().slice(0, 2);
  } catch (error) {
    console.error('Error getting user initials:', error);
    return 'U';
  }
};

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    role: "all",
    ministryLevel: "all",
    status: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Create User Form State
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "member" as "admin" | "member" | "visitor",
    ministryRole: "none" as MinistryRole | "none" | "",
    ministryLevel: "none" as MinistryLevel | "none" | "",
    ministryDescription: "",
    temporaryPassword: "",
  });
  const [createLoading, setCreateLoading] = useState(false);

  // Edit User Form State
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "member" as "admin" | "member" | "visitor",
    ministryRole: "" as MinistryRole | "none" | "",
    ministryLevel: "" as MinistryLevel | "none" | "",
    ministryDescription: "",
    isActive: true,
  });
  const [editLoading, setEditLoading] = useState(false);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error loading users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    const filtered = users.filter((user) => {
      const matchesSearch = !filters.search ||
          user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
          (user.phone?.includes(filters.search));

      const matchesRole = filters.role === "all" || user.role === filters.role;
      const matchesMinistryLevel =
          filters.ministryLevel === "all" ||
          (user.ministryLevel && user.ministryLevel === filters.ministryLevel);

      const matchesStatus =
          filters.status === "all" ||
          (filters.status === "active" && user.isActive) ||
          (filters.status === "inactive" && !user.isActive);

      return matchesSearch && matchesRole && matchesMinistryLevel && matchesStatus;
    });

    // Sort users
    filtered.sort((a, b) => {
      let aValue = a[filters.sortBy as keyof User];
      let bValue = b[filters.sortBy as keyof User];

      if (aValue === null || aValue === undefined) aValue = "";
      if (bValue === null || bValue === undefined) bValue = "";

      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

    return filtered;
  }, [users, filters]);

  if (status === "loading") {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    redirect("/members/dashboard");
  }

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Create user
  const handleCreateUser = async () => {
    if (!createForm.name || !createForm.email || !createForm.temporaryPassword) {
      toast.error("Please fill in all required fields");
      return;
    }

    setCreateLoading(true);
    try {
      // Convert "none" to null for ministry fields
      const payload = {
        ...createForm,
        ministryRole: createForm.ministryRole === "none" || createForm.ministryRole === "" ? null : createForm.ministryRole,
        ministryLevel: createForm.ministryLevel === "none" || createForm.ministryLevel === "" ? null : createForm.ministryLevel,
        ministryDescription: createForm.ministryDescription || null,
      };

      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("User created successfully");
        setShowCreateModal(false);
        setCreateForm({
          name: "",
          email: "",
          phone: "",
          role: "member",
          ministryRole: "none",
          ministryLevel: "none",
          ministryDescription: "",
          temporaryPassword: "",
        });
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Error creating user");
    } finally {
      setCreateLoading(false);
    }
  };

  // Update user
  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    setEditLoading(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          role: editForm.role,
          isActive: editForm.isActive,
          ministryRole: (!editForm.ministryRole || editForm.ministryRole === "none") ? null : editForm.ministryRole,
          ministryLevel: (!editForm.ministryLevel || editForm.ministryLevel === "none") ? null : editForm.ministryLevel,
          ministryDescription: editForm.ministryDescription || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("User updated successfully");
        setShowEditModal(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user");
    } finally {
      setEditLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/admin/users?userId=${userToDelete.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("User deleted successfully");
        setShowDeleteDialog(false);
        setUserToDelete(null);
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error deleting user");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Bulk actions
  const handleBulkAction = async (action: "activate" | "deactivate" | "delete") => {
    if (selectedUsers.length === 0) {
      toast.error("Please select users first");
      return;
    }

    setBulkActionLoading(true);
    try {
      const promises = selectedUsers.map((userId) => {
        if (action === "activate" || action === "deactivate") {
          return fetch("/api/admin/users", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              isActive: action === "activate",
            }),
          });
        } else if (action === "delete") {
          return fetch(`/api/admin/users?userId=${userId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });
        }
        return Promise.resolve();
      });

      await Promise.all(promises);
      toast.success(`${selectedUsers.length} user(s) ${action === "delete" ? "deleted" : action + "d"} successfully`);
      setSelectedUsers([]);
      fetchUsers();
    } catch (error) {
      console.error("Error with bulk action:", error);
      toast.error("Error performing bulk action");
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Export users
  const handleExport = () => {
    const csvContent = [
      [
        "Name",
        "Email",
        "Role",
        "Ministry Role",
        "Ministry Level",
        "Ministry Description",
        "Status",
        "Phone",
        "Membership Date",
        "Created Date",
      ],
      ...filteredUsers.map((user) => [
        user.name,
        user.email,
        user.role,
        user.ministryRole || "",
        user.ministryLevel || "",
        user.ministryDescription || "",
        user.isActive ? "Active" : "Inactive",
        user.phone || "",
        user.membershipDate ? new Date(user.membershipDate).toLocaleDateString() : "",
        new Date(user.createdAt).toLocaleDateString(),
      ]),
    ]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `church-members-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Users exported successfully");
  };

  // Helper function to get role badge color - Using church theme
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin": return "bg-primary/15 text-primary dark:bg-primary/20 dark:text-primary";
      case "member": return "bg-secondary/15 text-primary dark:bg-secondary/20 dark:text-primary";
      default: return "bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground";
    }
  };

  // Helper function to get status badge color - Using church theme
  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive
      ? "bg-secondary/20 text-primary dark:bg-secondary/20 dark:text-primary"
      : "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive";
  };

  return (
    <AdminLayout>
      <div className="container max-w-7xl py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Manage church members, administrators, and ministry roles
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={filteredUsers.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button size="sm" onClick={() => setShowCreateModal(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                {users.filter(u => u.isActive).length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Members</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.role === "member").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Church members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrators</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.role === "admin").length}
              </div>
              <p className="text-xs text-muted-foreground">
                Admin users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => {
                  const created = new Date(u.createdAt);
                  const now = new Date();
                  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                  return created >= thisMonth;
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">
                New registrations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                      id="search"
                      placeholder="Search by name, email, or phone..."
                      value={filters.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                      className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select
                    value={filters.role}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="visitor">Visitor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ministry Level</Label>
                <Select
                    value={filters.ministryLevel}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, ministryLevel: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {getMinistryLevelOptions().map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                    value={filters.status}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onValueChange={(value) => {
                      const [sortBy, sortOrder] = value.split("-");
                      setFilters(prev => ({
                        ...prev,
                        sortBy,
                        sortOrder: sortOrder as "asc" | "desc"
                      }));
                    }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="email-asc">Email (A-Z)</SelectItem>
                    <SelectItem value="email-desc">Email (Z-A)</SelectItem>
                    <SelectItem value="createdAt-desc">Newest First</SelectItem>
                    <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                    <SelectItem value="role-asc">Role (A-Z)</SelectItem>
                    <SelectItem value="role-desc">Role (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm font-medium">
                {selectedUsers.length} user(s) selected
              </span>
                  <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkAction("activate")}
                        disabled={bulkActionLoading}
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Activate
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBulkAction("deactivate")}
                        disabled={bulkActionLoading}
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      Deactivate
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedUsers([])}
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
            )}
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
              <CardDescription>
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
              </CardDescription>
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={fetchUsers}
                disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading users...</span>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    No users found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Try adjusting your search or filters
                  </p>
                </div>
            ) : (
                <>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                                checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedUsers(paginatedUsers.map(u => u.id));
                                  } else {
                                    setSelectedUsers([]);
                                  }
                                }}
                            />
                          </TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Ministry Role</TableHead>
                          <TableHead>Ministry Level</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Member Since</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <Checkbox
                                    checked={selectedUsers.includes(user.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedUsers(prev => [...prev, user.id]);
                                      } else {
                                        setSelectedUsers(prev => prev.filter(id => id !== user.id));
                                      }
                                    }}
                                />
                              </TableCell>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {getUserInitials(user.name)}
                              </span>
                                  </div>
                                  <div>
                                    <div className="font-medium">{user.name}</div>
                                    {user.id === session.user.id && (
                                        <div className="text-xs text-primary">You</div>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-gray-400" />
                                  {user.email}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getRoleBadgeVariant(user.role)}>
                                  {user.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {user.ministryRole
                                    ? getMinistryRoleOptions().find(opt => opt.value === user.ministryRole)?.label || user.ministryRole
                                    : <span className="text-gray-400">-</span>
                                }
                              </TableCell>
                              <TableCell>
                                {user.ministryLevel
                                    ? getMinistryLevelOptions().find(opt => opt.value === user.ministryLevel)?.label || user.ministryLevel
                                    : <span className="text-gray-400">-</span>
                                }
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusBadgeVariant(user.isActive)}>
                                  {user.isActive ? (
                                      <span>
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Active
                                      </span>
                                  ) : (
                                      <span>
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        Inactive
                                      </span>
                                  )}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {user.phone ? (
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-gray-400" />
                                      {user.phone}
                                    </div>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {user.membershipDate ? (
                                    new Date(user.membershipDate).toLocaleDateString()
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {new Date(user.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  {/* Direct action buttons for quick access */}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setEditForm({
                                        name: user.name,
                                        email: user.email,
                                        phone: user.phone || "",
                                        role: user.role,
                                        ministryRole: (user.ministryRole as MinistryRole) || "none",
                                        ministryLevel: (user.ministryLevel as MinistryLevel) || "none",
                                        ministryDescription: user.ministryDescription || "",
                                        isActive: user.isActive,
                                      });
                                      setShowEditModal(true);
                                    }}
                                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                    title="Edit user"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setUserToDelete(user);
                                      setShowDeleteDialog(true);
                                    }}
                                    disabled={user.id === session.user.id}
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title={user.id === session.user.id ? "Cannot delete yourself" : "Delete user"}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>More Actions</DropdownMenuLabel>
                                      <DropdownMenuItem
                                          onClick={() => {
                                            setSelectedUser(user);
                                            setShowDetailsModal(true);
                                          }}
                                      >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Details
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                          onClick={() => {
                                            setSelectedUsers([user.id]);
                                            handleBulkAction(user.isActive ? "deactivate" : "activate");
                                          }}
                                          disabled={user.id === session.user.id}
                                      >
                                        {user.isActive ? (
                                            <span className="flex items-center">
                                              <UserX className="h-4 w-4 mr-2" />
                                              Deactivate
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                              <UserCheck className="h-4 w-4 mr-2" />
                                              Activate
                                            </span>
                                        )}
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                          onClick={() => {
                                            setUserToDelete(user);
                                            setShowDeleteDialog(true);
                                          }}
                                          disabled={user.id === session.user.id}
                                          className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete User
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TableCell>
                            </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-6">
                        <div className="text-sm text-gray-500">
                          Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                          </Button>
                          <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                              disabled={currentPage === totalPages}
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                  )}
                </>
            )}
          </CardContent>
        </Card>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new member or administrator to the church system.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-name">Full Name *</Label>
                <Input
                    id="create-name"
                    value={createForm.name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-email">Email Address *</Label>
                <Input
                    id="create-email"
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-phone">Phone Number</Label>
                <Input
                    id="create-phone"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-role">Role *</Label>
                <Select
                    value={createForm.role}
                    onValueChange={(value) => setCreateForm(prev => ({ ...prev, role: value as "admin" | "member" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-ministry-role">Ministry Role</Label>
                <Select
                    value={createForm.ministryRole}
                    onValueChange={(value) => setCreateForm(prev => ({ ...prev, ministryRole: value as MinistryRole }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ministry role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {getMinistryRoleOptions().map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-ministry-level">Ministry Level</Label>
                <Select
                    value={createForm.ministryLevel}
                    onValueChange={(value) => setCreateForm(prev => ({ ...prev, ministryLevel: value as MinistryLevel }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ministry level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {getMinistryLevelOptions().map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-ministry-description">Ministry Description</Label>
                <Input
                    id="create-ministry-description"
                    value={createForm.ministryDescription}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, ministryDescription: e.target.value }))}
                    placeholder="Describe ministry role (optional)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-password">Temporary Password *</Label>
                <Input
                    id="create-password"
                    type="password"
                    value={createForm.temporaryPassword}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, temporaryPassword: e.target.value }))}
                    placeholder="Enter temporary password"
                />
                <p className="text-xs text-gray-500">
                  User will be prompted to change this password on first login
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  disabled={createLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateUser} disabled={createLoading}>
                {createLoading ? (
                    <span>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </span>
                ) : (
                    <span>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create User
                    </span>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user role, ministry, and status.
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedUser.name}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedUser.email}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-role">Role</Label>
                    <Select
                        value={editForm.role}
                        onValueChange={(value) => setEditForm(prev => ({ ...prev, role: value as "admin" | "member" }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-ministry-role">Ministry Role</Label>
                    <Select
                        value={editForm.ministryRole}
                        onValueChange={(value) => setEditForm(prev => ({ ...prev, ministryRole: value as MinistryRole }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ministry role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {getMinistryRoleOptions().map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-ministry-level">Ministry Level</Label>
                    <Select
                        value={editForm.ministryLevel}
                        onValueChange={(value) => setEditForm(prev => ({ ...prev, ministryLevel: value as MinistryLevel }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ministry level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {getMinistryLevelOptions().map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-ministry-description">Ministry Description</Label>
                    <Input
                        id="edit-ministry-description"
                        value={editForm.ministryDescription}
                        onChange={(e) => setEditForm(prev => ({ ...prev, ministryDescription: e.target.value }))}
                        placeholder="Describe ministry role (optional)"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                        id="edit-active"
                        checked={editForm.isActive}
                        onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isActive: checked as boolean }))}
                        disabled={selectedUser.id === session.user.id}
                    />
                    <Label htmlFor="edit-active">
                      Active user
                      {selectedUser.id === session.user.id && (
                          <span className="text-xs text-gray-500 ml-2">(Cannot deactivate yourself)</span>
                      )}
                    </Label>
                  </div>
                </div>
            )}
            <DialogFooter>
              <Button
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  disabled={editLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateUser} disabled={editLoading}>
                {editLoading ? (
                    <span>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </span>
                ) : (
                    <span>
                      <Edit className="h-4 w-4 mr-2" />
                      Update User
                    </span>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Complete information about this user.
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-primary">
                    {getUserInitials(selectedUser.name)}
                  </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getRoleBadgeVariant(selectedUser.role)}>
                          {selectedUser.role}
                        </Badge>
                        <Badge className={getStatusBadgeVariant(selectedUser.isActive)}>
                          {selectedUser.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="font-medium">Email</Label>
                      <div className="text-gray-600 dark:text-gray-400">{selectedUser.email}</div>
                    </div>
                    <div>
                      <Label className="font-medium">Phone</Label>
                      <div className="text-gray-600 dark:text-gray-400">
                        {selectedUser.phone || "Not provided"}
                      </div>
                    </div>
                    <div>
                      <Label className="font-medium">Ministry Role</Label>
                      <div className="text-gray-600 dark:text-gray-400">
                        {selectedUser.ministryRole
                            ? getMinistryRoleOptions().find(opt => opt.value === selectedUser.ministryRole)?.label || selectedUser.ministryRole
                            : "N/A"
                        }
                      </div>
                    </div>
                    <div>
                      <Label className="font-medium">Ministry Level</Label>
                      <div className="text-gray-600 dark:text-gray-400">
                        {selectedUser.ministryLevel
                            ? getMinistryLevelOptions().find(opt => opt.value === selectedUser.ministryLevel)?.label || selectedUser.ministryLevel
                            : "N/A"
                        }
                      </div>
                    </div>
                    <div>
                      <Label className="font-medium">Ministry Description</Label>
                      <div className="text-gray-600 dark:text-gray-400">
                        {selectedUser.ministryDescription || "N/A"}
                      </div>
                    </div>
                    <div>
                      <Label className="font-medium">Member Since</Label>
                      <div className="text-gray-600 dark:text-gray-400">
                        {selectedUser.membershipDate
                            ? new Date(selectedUser.membershipDate).toLocaleDateString()
                            : "N/A"
                        }
                      </div>
                    </div>
                    <div>
                      <Label className="font-medium">Account Created</Label>
                      <div className="text-gray-600 dark:text-gray-400">
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {selectedUser.id === session.user.id && (
                      <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-primary dark:text-primary">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">This is your account</span>
                        </div>
                      </div>
                  )}
                </div>
            )}
            <DialogFooter>
              <Button
                  variant="outline"
                  onClick={() => setShowDetailsModal(false)}
              >
                Close
              </Button>
              {selectedUser && (
                  <Button
                      onClick={() => {
                        setEditForm({
                          name: selectedUser.name,
                          email: selectedUser.email,
                          phone: selectedUser.phone || "",
                          role: selectedUser.role,
                          ministryRole: (selectedUser.ministryRole as MinistryRole) || "none",
                          ministryLevel: (selectedUser.ministryLevel as MinistryLevel) || "none",
                          ministryDescription: selectedUser.ministryDescription || "",
                          isActive: selectedUser.isActive,
                        });
                        setShowDetailsModal(false);
                        setShowEditModal(true);
                      }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit User
                  </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {userToDelete && (
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {userToDelete.name}
                    </div>
                  </div>
              )}
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {userToDelete?.email || "N/A"}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {userToDelete?.role || "N/A"}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                  disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button
                  onClick={handleDeleteUser}
                  disabled={deleteLoading}
              >
                {deleteLoading ? (
                    <span>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </span>
                ) : (
                    <span>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete User
                    </span>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
