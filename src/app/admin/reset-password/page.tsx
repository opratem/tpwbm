'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertTriangle,
  Shield,
  CheckCircle,
  Key,
  Search,
  Eye,
  EyeOff,
  Copy,
  Loader2,
  Lock,
  Unlock,
  Users,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { AdminLayout } from '@/components/admin/admin-layout';
import { SUPER_ADMIN_EMAIL } from '@/lib/constants';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  hasPassword: boolean;
}

const isSuperAdmin = (email: string | null | undefined, role: string | null | undefined): boolean => {
  return email?.toLowerCase() === SUPER_ADMIN_EMAIL?.toLowerCase() && role === 'super_admin';
};

const getUserInitials = (name: string | null | undefined): string => {
  if (!name || typeof name !== 'string' || name.trim() === '') return 'U';
  const words = name.trim().split(' ').filter(word => word.length > 0);
  if (words.length === 0) return 'U';
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return words.map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Component for super admin to reset user passwords
function SuperAdminPasswordReset() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/super-admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error loading users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user && isSuperAdmin(session.user.email, session.user.role)) {
      fetchUsers();
    }
  }, [session, fetchUsers]);

  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const handlePasswordReset = async (useCustom: boolean) => {
    if (!selectedUser) return;
    setPasswordResetLoading(true);
    try {
      const response = await fetch('/api/super-admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          action: 'reset-password',
          customPassword: useCustom ? newPassword : undefined,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`Password reset for ${selectedUser.name || selectedUser.email}`);
        setGeneratedPassword(data.temporaryPassword);
        setNewPassword('');
        fetchUsers();
      } else {
        toast.error(data.error || 'Failed to reset password');
      }
    } catch (error) {
      toast.error('Error resetting password');
    } finally {
      setPasswordResetLoading(false);
    }
  };

  const copyPassword = (password: string) => {
    navigator.clipboard.writeText(password);
    toast.success('Password copied to clipboard');
  };

  const openPasswordModal = (user: User) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
    setGeneratedPassword(null);
    setNewPassword('');
    setShowPassword(false);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setSelectedUser(null);
    setGeneratedPassword(null);
    setNewPassword('');
    setShowPassword(false);
  };

  return (
    <AdminLayout>
      <div className="container max-w-5xl py-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <Key className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset User Passwords</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Help members reset their passwords</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Security Notice */}
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Security Notice:</strong> Only reset passwords for verified members who have forgotten their credentials.
                All password resets are logged for security purposes.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Find User
            </CardTitle>
            <CardDescription>Search for the member whose password you want to reset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                <span className="ml-2 text-gray-600">Loading users...</span>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">
                  {searchQuery ? 'No users found matching your search' : 'No users found'}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Password Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const isSuperAdminUser = user.role === 'super_admin';
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isSuperAdminUser ? 'bg-amber-100' : 'bg-gray-100'
                            }`}>
                              <span className={`text-sm font-medium ${
                                isSuperAdminUser ? 'text-amber-700' : 'text-gray-700'
                              }`}>
                                {getUserInitials(user.name)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {user.name || 'Unnamed User'}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={user.hasPassword
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                          }>
                            {user.hasPassword ? (
                              <><Lock className="h-3 w-3 mr-1" /> Set</>
                            ) : (
                              <><Unlock className="h-3 w-3 mr-1" /> Not Set</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {!isSuperAdminUser ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openPasswordModal(user)}
                              className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
                            >
                              <Key className="h-4 w-4 mr-2" />
                              Reset Password
                            </Button>
                          ) : (
                            <span className="text-sm text-gray-400">Super Admin</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Password Reset Modal */}
        <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-orange-500" />
                Reset Password
              </DialogTitle>
              <DialogDescription>
                Reset password for {selectedUser?.name || selectedUser?.email}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* User Info */}
              {selectedUser && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                      {getUserInitials(selectedUser.name)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{selectedUser.name || 'Unnamed User'}</div>
                    <div className="text-sm text-gray-500">{selectedUser.email}</div>
                  </div>
                </div>
              )}

              {generatedPassword ? (
                /* Success State - Show Generated Password */
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-green-700 dark:text-green-400">New Password</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyPassword(generatedPassword)}
                      className="h-8 text-green-600 hover:text-green-700"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={generatedPassword}
                      readOnly
                      className="font-mono bg-white dark:bg-gray-900"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                    Share this password securely with the member. They can change it after logging in.
                  </p>
                </div>
              ) : (
                /* Reset Options */
                <>
                  {/* Generate Password Option */}
                  <Button
                    onClick={() => handlePasswordReset(false)}
                    disabled={passwordResetLoading}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    {passwordResetLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Key className="h-4 w-4 mr-2" />
                        Generate Easy-to-Remember Password
                      </>
                    )}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white dark:bg-gray-950 px-2 text-gray-500">or</span>
                    </div>
                  </div>

                  {/* Custom Password Option */}
                  <div className="space-y-2">
                    <Label>Set Custom Password</Label>
                    <div className="flex gap-2">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter a custom password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Button
                      onClick={() => handlePasswordReset(true)}
                      disabled={passwordResetLoading || !newPassword.trim()}
                      variant="outline"
                      className="w-full"
                    >
                      {passwordResetLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Setting...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Set Custom Password
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closePasswordModal}>
                {generatedPassword ? 'Done' : 'Cancel'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

// Component for users who clicked an email reset link
function EmailTokenPasswordReset() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [tokenValid, setTokenValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`/api/admin/password-reset-complete?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setTokenValid(true);
          setUserEmail(data.email);
        } else {
          setError(data.error || 'Invalid or expired token');
        }
      })
      .catch(() => {
        setError('Failed to validate reset token');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setSubmitting(false);
      return;
    }

    if (formData.newPassword.length < 12) {
      setError('Password must be at least 12 characters long');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/password-reset-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/members/login?message=password-reset-success');
        }, 3000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-2 text-gray-600">Validating reset token...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
            <p className="text-gray-600 mb-4">Redirecting to login...</p>
            <Button onClick={() => router.push('/members/login')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-4">{error || 'No reset token provided'}</p>
            <Button onClick={() => router.push('/members/forgot-password')} variant="outline" className="w-full">
              Request New Reset Link
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <CardTitle className="text-2xl font-bold">Admin Password Reset</CardTitle>
          <CardDescription>Reset password for: <strong>{userEmail}</strong></CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert className="mb-6" variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter your new password (minimum 12 characters)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm your new password"
                required
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Resetting Password...
                </div>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-2" />
              <div className="text-sm text-amber-800">
                <strong>Security Notice:</strong> This is an admin account password reset.
                If you did not request this reset, contact the technical team immediately.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main component that decides which view to show
function AdminResetPasswordContent() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const token = searchParams.get('token');

  // If there's a token, show the email reset form
  if (token) {
    return <EmailTokenPasswordReset />;
  }

  // If still loading session, show loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600" />
      </div>
    );
  }

  // If user is super admin, show the password reset interface
  if (session?.user && isSuperAdmin(session.user.email, session.user.role)) {
    return <SuperAdminPasswordReset />;
  }

  // Otherwise, redirect to dashboard (not authorized)
  if (status === 'authenticated') {
    router.push('/admin/dashboard');
    return null;
  }

  // Not logged in, redirect to login
  router.push('/members/login');
  return null;
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminResetPasswordContent />
    </Suspense>
  );
}
