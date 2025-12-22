import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-church-primary/5 to-church-accent/5 p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto">
            <h1 className="text-8xl sm:text-9xl font-bold text-church-accent/30" aria-label="404 Error">
              404
            </h1>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-church-primary">
            Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              variant="default"
              className="flex items-center gap-2"
              aria-label="Go to homepage"
            >
              <Link href="/">
                <Home className="w-4 h-4" aria-hidden="true" />
                Go to Homepage
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex items-center gap-2"
              aria-label="Go back to previous page"
            >
              <Link href="javascript:history.back()">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Go Back
              </Link>
            </Button>
          </div>

          <div className="pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              Popular pages you might be looking for:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button asChild variant="ghost" size="sm">
                <Link href="/about">About Us</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/services">Services</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/events">Events</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/sermons">Sermons</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/contact">Contact</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
