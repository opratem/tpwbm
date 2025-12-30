"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-church-primary/5 to-church-accent/5 p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-destructive" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-church-primary">
            Something Went Wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              We apologize for the inconvenience. An unexpected error has occurred.
            </p>
            {error.digest && (
              <p className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded">
                Error ID: {error.digest}
              </p>
            )}
          </div>

          {process.env.NODE_ENV === "development" && (
            <div className="text-left bg-destructive/5 p-4 rounded-lg border border-destructive/20">
              <p className="text-sm font-semibold text-destructive mb-2">
                Development Error Details:
              </p>
              <pre className="text-xs overflow-auto text-destructive/90">
                {error.message}
              </pre>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={reset}
              variant="default"
              className="flex items-center gap-2"
              aria-label="Try again"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Try Again
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
              className="flex items-center gap-2"
              aria-label="Go to homepage"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              Go to Homepage
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            If this problem persists, please{" "}
            <a
              href="/contact"
              className="text-church-primary hover:underline font-medium"
            >
              contact us
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
