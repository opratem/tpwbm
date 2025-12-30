"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface ConfigCheck {
  status: string;
  criticalIssues: string[];
  checks: any;
  recommendations: string[];
}

export default function DiagnosticPage() {
  const { data: session, status } = useSession();
  const [config, setConfig] = useState<ConfigCheck | null>(null);
  const [loading, setLoading] = useState(true);

  const checkConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/verify-config");
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error("Failed to check config:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConfig();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            System Diagnostics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Check your system configuration and authentication status
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {status === "authenticated" ? (
                <CheckCircle2 className="text-green-500" />
              ) : (
                <XCircle className="text-red-500" />
              )}
              Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <Badge
                  variant={
                    status === "authenticated" ? "default" : "destructive"
                  }
                >
                  {status}
                </Badge>
              </div>
              {session?.user && (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-sm">{session.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <Badge>{session.user.role}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">User ID</p>
                    <p className="text-sm text-gray-600">{session.user.id}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {loading ? (
                  <RefreshCw className="animate-spin text-blue-500" size={20} />
                ) : config?.status === "OK" ? (
                  <CheckCircle2 className="text-green-500" />
                ) : (
                  <AlertCircle className="text-red-500" />
                )}
                Environment Configuration
              </CardTitle>
              <CardDescription>
                {config?.checks?.environment} environment
              </CardDescription>
            </div>
            <Button onClick={checkConfig} variant="outline" size="sm">
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw
                  className="animate-spin mx-auto mb-4 text-blue-500"
                  size={32}
                />
                <p className="text-gray-500">Checking configuration...</p>
              </div>
            ) : config ? (
              <div className="space-y-6">
                {config.criticalIssues.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-red-500 mt-0.5" size={20} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                          Critical Issues Detected
                        </h3>
                        <ul className="space-y-1 text-sm text-red-800 dark:text-red-200">
                          {config.criticalIssues.map((issue, i) => (
                            <li key={i}>• {issue}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {config.checks?.nextauth_url?.warning && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle
                        className="text-yellow-500 mt-0.5"
                        size={20}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                          {config.checks.nextauth_url.warning}
                        </h3>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          Current value: {config.checks.nextauth_url.value}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Configuration Details
                  </h3>
                  <div className="grid gap-3">
                    <ConfigItem
                      label="NEXTAUTH_URL"
                      configured={config.checks?.nextauth_url?.configured}
                      value={config.checks?.nextauth_url?.value}
                      critical
                    />
                    <ConfigItem
                      label="NEXTAUTH_SECRET"
                      configured={config.checks?.nextauth_secret?.configured}
                      value={config.checks?.nextauth_secret?.value}
                      critical
                    />
                    <ConfigItem
                      label="Database"
                      configured={config.checks?.database?.configured}
                      critical
                    />
                    <ConfigItem
                      label="Paystack"
                      configured={
                        config.checks?.paystack?.public_key &&
                        config.checks?.paystack?.secret_key
                      }
                    />
                    <ConfigItem
                      label="Cloudinary"
                      configured={config.checks?.cloudinary?.configured}
                    />
                  </div>
                </div>

                {config.recommendations.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Recommendations
                    </h3>
                    <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                      {config.recommendations.map((rec, i) => (
                        <li key={i}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Failed to load configuration
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <a href="/api/auth/session" target="_blank" rel="noreferrer">
                Check Session API →
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <a href="/members/login">Go to Login →</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ConfigItem({
  label,
  configured,
  value,
  critical = false,
}: {
  label: string;
  configured: boolean;
  value?: string;
  critical?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center gap-3">
        {configured ? (
          <CheckCircle2 className="text-green-500" size={18} />
        ) : (
          <XCircle
            className={critical ? "text-red-500" : "text-yellow-500"}
            size={18}
          />
        )}
        <span className="font-medium text-sm">{label}</span>
        {critical && !configured && (
          <Badge variant="destructive" className="text-xs">
            Critical
          </Badge>
        )}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {value ? value : configured ? "Configured" : "Not Set"}
      </div>
    </div>
  );
}
