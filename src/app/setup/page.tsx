"use client";

import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  EyeOff,
  Crown,
  Lock,
} from "lucide-react";

export default function SetupPage() {
  const [secret, setSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [superAdminExists, setSuperAdminExists] = useState(false);
  const [superAdminInfo, setSuperAdminInfo] = useState<{
    email: string;
    role: string;
    isActive: boolean;
  } | null>(null);

  // Check if super admin exists on page load
  useEffect(() => {
    checkSuperAdmin();
  }, []);

  const checkSuperAdmin = async () => {
    setChecking(true);
    try {
      const response = await fetch("/api/setup/seed-super-admin");
      const data = await response.json();
      setSuperAdminExists(data.exists);
      setSuperAdminInfo(data.user);
    } catch (error) {
      console.error("Error checking super admin:", error);
    } finally {
      setChecking(false);
    }
  };

  const handleSeedSuperAdmin = async () => {
    if (!secret.trim()) {
      toast.error("Please enter the setup secret");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/setup/seed-super-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Super admin created successfully!");
        setSuperAdminExists(true);
        setSuperAdminInfo({
          email: data.email,
          role: "super_admin",
          isActive: true,
        });
        setSecret("");
      } else {
        toast.error(data.error || "Failed to create super admin");
      }
    } catch (error) {
      console.error("Error seeding super admin:", error);
      toast.error("An error occurred while creating super admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-amber-500/30 shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Crown className="h-9 w-9 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            Super Admin Setup
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Initialize the super admin account for TPWBM
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {checking ? (
            <div className="flex flex-col items-center gap-3 py-6">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
              <p className="text-sm text-muted-foreground">
                Checking super admin status...
              </p>
            </div>
          ) : superAdminExists ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-300">
                    Super Admin Exists
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Account has been configured
                  </p>
                </div>
              </div>

              {superAdminInfo && (
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">Account Details</span>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>
                      <span className="font-medium text-foreground">
                        Email:
                      </span>{" "}
                      {superAdminInfo.email}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">Role:</span>{" "}
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs">
                        <Crown className="h-3 w-3 mr-1" />
                        {superAdminInfo.role}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Status:
                      </span>{" "}
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                          superAdminInfo.isActive
                            ? "bg-green-500/20 text-green-700 dark:text-green-300"
                            : "bg-red-500/20 text-red-700 dark:text-red-300"
                        }`}
                      >
                        {superAdminInfo.isActive ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  <strong>Credentials:</strong>
                  <br />
                  Email: superadmin@tpwbm.org
                  <br />
                  Password: superadmin123
                </p>
              </div>

              <Button
                onClick={() => (window.location.href = "/members/login")}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
              >
                <Lock className="h-4 w-4 mr-2" />
                Go to Login
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <XCircle className="h-6 w-6 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-300">
                    Super Admin Not Found
                  </p>
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    Enter the setup secret to create the account
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secret" className="text-sm font-medium">
                  Setup Secret
                </Label>
                <div className="relative">
                  <Input
                    id="secret"
                    type={showSecret ? "text" : "password"}
                    placeholder="Enter setup secret"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    className="pr-10"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSeedSuperAdmin();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full hover:bg-transparent"
                    onClick={() => setShowSecret(!showSecret)}
                  >
                    {showSecret ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Default secret: <code className="bg-muted px-1 py-0.5 rounded">tpwbm-setup-2024</code>
                </p>
              </div>

              <Button
                onClick={handleSeedSuperAdmin}
                disabled={loading || !secret.trim()}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Super Admin...
                  </>
                ) : (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Create Super Admin
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  This will create a super admin account with:
                  <br />
                  <strong>Email:</strong> superadmin@tpwbm.org
                  <br />
                  <strong>Password:</strong> superadmin123
                </p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              onClick={checkSuperAdmin}
              disabled={checking}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              {checking ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Refresh Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
