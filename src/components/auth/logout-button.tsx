"use client";

import { useState, useCallback } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showConfirmation?: boolean;
  redirectTo?: string;
}

export function LogoutButton({
  variant = "outline",
  size = "default",
  className = "",
  showConfirmation = true,
  redirectTo = "/"
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const performSignOut = useCallback(async () => {
    try {
      setIsLoading(true);

      // Close dialog immediately to prevent UI issues
      setIsDialogOpen(false);

      // Show toast notification
      toast.success("Signing out...");

      // Small delay to allow dialog to close and UI to update
      await new Promise(resolve => setTimeout(resolve, 100));

      // Perform the sign out - this will redirect
      await signOut({
        callbackUrl: redirectTo,
        redirect: true
      });

      // This code won't execute because redirect: true causes a full page redirect
      // But we keep it as a fallback
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
      setIsLoading(false);

      // Fallback: Force redirect to clear any stale state
      window.location.href = redirectTo;
    }
  }, [redirectTo]);

  const handleButtonClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (showConfirmation) {
      setIsDialogOpen(true);
    } else {
      performSignOut();
    }
  }, [showConfirmation, performSignOut]);

  const handleConfirmLogout = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    performSignOut();
  }, [performSignOut]);

  const handleCancelClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDialogOpen(false);
  }, []);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled={isLoading}
        onClick={handleButtonClick}
        type="button"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4 mr-2" />
        )}
        {isLoading ? "Signing out..." : "Sign Out"}
      </Button>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="z-[100] bg-white dark:bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? You'll need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelClick}
              disabled={isLoading}
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmLogout}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
              type="button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing out...
                </>
              ) : (
                "Sign Out"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
