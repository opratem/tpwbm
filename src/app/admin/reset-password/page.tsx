'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react';

function AdminResetPasswordContent() {
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
      setError('No reset token provided');
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
              <p className="text-gray-600 mb-4">{error}</p>
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
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
