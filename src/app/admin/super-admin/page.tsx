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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ShieldAlert,
  Users,
  Search,
  Eye,
  EyeOff,
  Key,
  UserCog,
  Crown,
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Copy,
  Mail,
  Phone,
  Lock,
  Unlock,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { SUPER_ADMIN_EMAIL } from "@/lib/constants";

interface SuperAdminUser {
  id: string;
  name: string | null;
  email: string;
  role: "super_admin" | "admin" | "member" | "visitor";
  isActive: boolean;
  createdAt: string;
  phone: string | null;
  hasPassword: boolean;
}

const isSuperAdmin = (email: string | null | undefined, role: string | null | undefined): boolean => {
  return email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase() && role === 'super_admin';
};

const getUserInitials = (name: string | null | undefined): string => {
  if (!name || typeof name !== 'string' || name.trim() === '') return 'U';
  const words = name.trim().split(' ').filter(word => word.length > 0);
  if (words.length === 0) return 'U';
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return words.map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export default function SuperAdminPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<SuperAdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SuperAdminUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "promote" | "demote" | "activate" | "deactivate";
    user: SuperAdminUser;
  } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/super-admin/users");
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
    if (session?.user && isSuperAdmin(session.user.email, session.user.role)) {
      fetchUsers();
    }
  }, [session, fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = !searchQuery ||
        (user.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "inactive" && !user.isActive);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: users.length,
    admins: users.filter(u => u.role === "admin").length,
    members: users.filter(u => u.role === "member").length,
    withoutPassword: users.filter(u => !u.hasPassword).length,
  }), [users]);

  const handlePasswordReset = async (useCustom: boolean) => {
    if (!selectedUser) return;
    setPasswordResetLoading(true);
    try {
      const response = await fetch("/api/super-admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          action: "reset-password",
          customPassword: useCustom ? newPassword : undefined,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`Password reset for ${selectedUser.name || selectedUser.email}`);
        setGeneratedPassword(data.temporaryPassword);
        setNewPassword("");
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to reset password");
      }
    } catch (error) {
      toast.error("Error resetting password");
    } finally {
      setPasswordResetLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    setConfirmLoading(true);
    try {
      const response = await fetch("/api/super-admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: confirmAction.user.id,
          ...(confirmAction.type === "promote" && { role: "admin" }),
          ...(confirmAction.type === "demote" && { role: "member" }),
          ...(confirmAction.type === "activate" && { isActive: true }),
          ...(confirmAction.type === "deactivate" && { isActive: false }),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        const verbs = { promote: "promoted", demote: "demoted", activate: "activated", deactivate: "deactivated" };
        toast.success(`${confirmAction.user.name || confirmAction.user.email} ${verbs[confirmAction.type]}`);
        setShowConfirmDialog(false);
        setConfirmAction(null);
        fetchUsers();
      } else {
        toast.error(data.error || "Failed to update user");
      }
    } catch (error) {
      toast.error("Error updating user");
    } finally {
      setConfirmLoading(false);
    }
  };

  const copyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
    toast.success("Password copied");
  };

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      super_admin: "bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-700 dark:text-amber-300 border border-amber-500/30",
      admin: "bg-primary/10 text-primary border border-primary/20",
      member: "bg-secondary/20 text-secondary-foreground border border-secondary/30",
      visitor: "bg-gray-500/20 text-gray-700 dark:text-gray-300 border border-gray-500/30",
    };
    return styles[role] || styles.visitor;
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500" />
      </div>
    );
  }

  if (!session || !isSuperAdmin(session.user.email, session.user.role)) {
    redirect("/admin/dashboard");
  }

  return (
    <AdminLayout>
      <div className="container max-w-7xl py-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">Super Admin Panel</h1>
              <p className="text-sm text-secondary font-medium">Password management & user administration</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading} className="border-amber-500/30 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all">
            <RefreshCw className={`h-4 w-4 mr-2 text-amber-600 ${loading ? "animate-spin" : ""}`} />
            <span className="text-amber-700 dark:text-amber-400">Refresh</span>
          </Button>
        </div>

        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                <strong>Security Notice:</strong> All actions are logged. Reset passwords only for verified members who forgot their credentials.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary/60" />
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              </div>
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-primary">{stats.total}</div></CardContent>
          </Card>
          <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary/60" />
                <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
              </div>
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-primary">{stats.admins}</div></CardContent>
          </Card>
          <Card className="border-secondary/30 bg-gradient-to-br from-background to-secondary/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-secondary" />
                <CardTitle className="text-sm font-medium text-muted-foreground">Members</CardTitle>
              </div>
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-secondary">{stats.members}</div></CardContent>
          </Card>
          <Card className="border-amber-500/30 bg-gradient-to-br from-background to-amber-500/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Unlock className="h-4 w-4 text-amber-500" />
                <CardTitle className="text-sm font-medium text-muted-foreground">No Password</CardTitle>
              </div>
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-amber-600">{stats.withoutPassword}</div></CardContent>
          </Card>
        </div>

        <Card className="border-primary/10">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
            <CardTitle className="flex items-center gap-2 text-primary">
              <UserCog className="h-5 w-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger><SelectValue placeholder="All Roles" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue placeholder="All Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-amber-500" /><span className="ml-2">Loading...</span></div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12"><Users className="h-12 w-12 mx-auto text-gray-400 mb-4" /><p>No users found</p></div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const isCurrentUser = user.email.toLowerCase() === session.user.email?.toLowerCase();
                    const isSuperAdminUser = user.role === "super_admin";
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSuperAdminUser ? "bg-amber-500/20" : "bg-primary/10"}`}>
                              <span className={`text-sm font-medium ${isSuperAdminUser ? "text-amber-600" : "text-primary"}`}>{getUserInitials(user.name)}</span>
                            </div>
                            <div>
                              <div className="font-medium">{user.name || "Unnamed"} {isCurrentUser && <Badge variant="outline" className="text-xs ml-1">You</Badge>}</div>
                              <div className="text-sm text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><Badge className={getRoleBadge(user.role)}>{isSuperAdminUser && <Crown className="h-3 w-3 mr-1" />}{user.role.replace("_", " ")}</Badge></TableCell>
                        <TableCell><Badge className={user.isActive ? "bg-green-500/20 text-green-700" : "bg-red-500/20 text-red-700"}>{user.isActive ? "Active" : "Inactive"}</Badge></TableCell>
                        <TableCell><Badge className={user.hasPassword ? "bg-green-500/10 text-green-600" : "bg-orange-500/10 text-orange-600"}>{user.hasPassword ? <><Lock className="h-3 w-3 mr-1" />Set</> : <><Unlock className="h-3 w-3 mr-1" />Not Set</>}</Badge></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {!isSuperAdminUser && (
                              <Button variant="ghost" size="sm" onClick={() => { setSelectedUser(user); setShowPasswordModal(true); setGeneratedPassword(null); }} className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-50" title="Reset password"><Key className="h-4 w-4" /></Button>
                            )}
                            {!isSuperAdminUser && !isCurrentUser && user.role !== "admin" && (
                              <Button variant="ghost" size="sm" onClick={() => { setConfirmAction({ type: "promote", user }); setShowConfirmDialog(true); }} className="h-8 w-8 p-0 text-green-600 hover:bg-green-50" title="Promote"><UserPlus className="h-4 w-4" /></Button>
                            )}
                            {!isSuperAdminUser && !isCurrentUser && user.role === "admin" && (
                              <Button variant="ghost" size="sm" onClick={() => { setConfirmAction({ type: "demote", user }); setShowConfirmDialog(true); }} className="h-8 w-8 p-0 text-orange-600 hover:bg-orange-50" title="Demote"><UserMinus className="h-4 w-4" /></Button>
                            )}
                            {!isSuperAdminUser && !isCurrentUser && (
                              <Button variant="ghost" size="sm" onClick={() => { setConfirmAction({ type: user.isActive ? "deactivate" : "activate", user }); setShowConfirmDialog(true); }} className={`h-8 w-8 p-0 ${user.isActive ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`} title={user.isActive ? "Deactivate" : "Activate"}>{user.isActive ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Key className="h-5 w-5 text-amber-500" />Reset Password</DialogTitle>
              <DialogDescription>Reset password for {selectedUser?.name || selectedUser?.email}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {selectedUser && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"><span className="text-sm font-medium text-primary">{getUserInitials(selectedUser.name)}</span></div>
                  <div><div className="font-medium">{selectedUser.name || "Unnamed"}</div><div className="text-sm text-muted-foreground">{selectedUser.email}</div></div>
                </div>
              )}
              {generatedPassword ? (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-green-700">New Password</Label>
                    <Button variant="ghost" size="sm" onClick={() => copyPassword(generatedPassword)} className="h-8 text-green-600"><Copy className="h-4 w-4 mr-1" />Copy</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type={showPassword ? "text" : "password"} value={generatedPassword} readOnly className="font-mono" />
                    <Button variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                  </div>
                  <p className="text-xs text-green-600 mt-2">Communicate this password securely to the user.</p>
                </div>
              ) : (
                <>
                  <Button onClick={() => handlePasswordReset(false)} disabled={passwordResetLoading} className="w-full bg-amber-500 hover:bg-amber-600">
                    {passwordResetLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating...</> : <><Key className="h-4 w-4 mr-2" />Generate Memorable Password</>}
                  </Button>
                  <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">or</span></div></div>
                  <div className="space-y-2">
                    <Label>Custom Password</Label>
                    <div className="flex gap-2">
                      <Input type={showPassword ? "text" : "password"} placeholder="Enter custom password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                      <Button variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                    </div>
                    <Button onClick={() => handlePasswordReset(true)} disabled={passwordResetLoading || !newPassword.trim()} variant="outline" className="w-full">
                      {passwordResetLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Setting...</> : <><Lock className="h-4 w-4 mr-2" />Set Custom Password</>}
                    </Button>
                  </div>
                </>
              )}
            </div>
            <DialogFooter><Button variant="outline" onClick={() => { setShowPasswordModal(false); setSelectedUser(null); setGeneratedPassword(null); setNewPassword(""); }}>Close</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmAction?.type === "promote" && "Promote to Admin"}
                {confirmAction?.type === "demote" && "Demote to Member"}
                {confirmAction?.type === "activate" && "Activate User"}
                {confirmAction?.type === "deactivate" && "Deactivate User"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {confirmAction && <>Are you sure you want to {confirmAction.type} <strong>{confirmAction.user.name || confirmAction.user.email}</strong>?</>}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={confirmLoading}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmAction} disabled={confirmLoading} className={confirmAction?.type === "deactivate" ? "bg-red-500" : confirmAction?.type === "promote" ? "bg-green-500" : ""}>
                {confirmLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
