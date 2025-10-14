"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/components/auth/logout-button";
import { Chrome, Facebook, CheckCircle, XCircle, Clock, User, Mail, Shield } from "lucide-react";
import { toast } from "sonner";

export default function OAuthTestPage() {
  const { data: session, status } = useSession();
  const [testResults, setTestResults] = useState<{
    google?: 'pending' | 'success' | 'error';
    facebook?: 'pending' | 'success' | 'error';
  }>({});

  const testOAuthProvider = async (provider: "google" | "facebook") => {
    setTestResults(prev => ({ ...prev, [provider]: 'pending' }));

    try {
      const result = await signIn(provider, {
        redirect: true,
        callbackUrl: '/test-oauth?test=success'
      });

      if (result?.error) {
        setTestResults(prev => ({ ...prev, [provider]: 'error' }));
        toast.error(`${provider} OAuth test failed: ${result.error}`);
      } else {
        setTestResults(prev => ({ ...prev, [provider]: 'success' }));
        toast.success(`${provider} OAuth test successful!`);
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, [provider]: 'error' }));
      toast.error(`${provider} OAuth test failed: ${error}`);
    }
  };

  const getStatusIcon = (status?: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status?: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'pending':
        return 'Testing...';
      case 'success':
        return 'Success';
      case 'error':
        return 'Failed';
      default:
        return 'Ready to test';
    }
  };

  return (
    <div className="container py-10 space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">OAuth Integration Testing</h1>
        <p className="text-lg text-muted-foreground">
          Test Google and Facebook OAuth providers for the church website
        </p>
      </div>

      {/* Current Session Info */}
      {session ? (
        <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/20 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-300">
              <User className="h-5 w-5" />
              Currently Signed In
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-muted-foreground">{session.user.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{session.user.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Role</p>
                <Badge variant={session.user.role === 'admin' ? 'destructive' : 'default'}>
                  {session.user.role}
                </Badge>
              </div>
              {session.user.ministryRole && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Ministry Role</p>
                  <Badge variant="outline">
                    {session.user.ministryRole.split('_').map(word =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Badge>
                </div>
              )}
              <div className="space-y-2">
                <p className="text-sm font-medium">User ID</p>
                <p className="text-xs text-muted-foreground font-mono">{session.user.id}</p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <LogoutButton
                variant="outline"
                showConfirmation={true}
                redirectTo="/test-oauth"
                className="w-full md:w-auto"
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-900/20 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
              <Shield className="h-5 w-5" />
              Not Signed In
            </CardTitle>
            <CardDescription>
              Test OAuth providers by clicking the buttons below
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* OAuth Provider Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google OAuth Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Chrome className="h-6 w-6 text-red-600" />
              Google OAuth
            </CardTitle>
            <CardDescription>
              Test Google sign-in integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(testResults.google)}
                <span className="text-sm">{getStatusText(testResults.google)}</span>
              </div>
            </div>

            <Button
              onClick={() => testOAuthProvider("google")}
              disabled={testResults.google === 'pending' || status === 'loading'}
              className="w-full"
              variant="outline"
            >
              <Chrome className="h-4 w-4 mr-2 text-red-600" />
              Test Google Sign-In
            </Button>

            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Environment Variables Required:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>GOOGLE_CLIENT_ID</li>
                <li>GOOGLE_CLIENT_SECRET</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Facebook OAuth Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Facebook className="h-6 w-6 text-blue-600" />
              Facebook OAuth
            </CardTitle>
            <CardDescription>
              Test Facebook sign-in integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(testResults.facebook)}
                <span className="text-sm">{getStatusText(testResults.facebook)}</span>
              </div>
            </div>

            <Button
              onClick={() => testOAuthProvider("facebook")}
              disabled={testResults.facebook === 'pending' || status === 'loading'}
              className="w-full"
              variant="outline"
            >
              <Facebook className="h-4 w-4 mr-2 text-blue-600" />
              Test Facebook Sign-In
            </Button>

            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Environment Variables Required:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>FACEBOOK_CLIENT_ID</li>
                <li>FACEBOOK_CLIENT_SECRET</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testing Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
          <CardDescription>
            How to properly test OAuth integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">1. Account Linking Test</h4>
            <p className="text-sm text-muted-foreground">
              If you have an existing account with email/password, try signing in with Google/Facebook using the same email to test automatic account linking.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">2. New User Test</h4>
            <p className="text-sm text-muted-foreground">
              Use an email that doesn't exist in the system to test new user creation via OAuth.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">3. Role-based Redirect Test</h4>
            <p className="text-sm text-muted-foreground">
              Admin users should be redirected to /admin/dashboard, while regular members go to /members/dashboard.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">4. Email Notifications</h4>
            <p className="text-sm text-muted-foreground">
              Check console logs for email notifications about account linking and login events.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
