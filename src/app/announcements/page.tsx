"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import Announcements from "@/components/ui/announcements";
import { Megaphone, Calendar, Tag, Eye, ChevronRight, Filter, X, Search, Bell } from "lucide-react";

export default function AnnouncementsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Breadcrumbs />
      <PageHeader
        title="Church Announcements"
        description="Stay updated with the latest news and important announcements from our church community."
        backgroundImage="/images/background/announcements_background.jpg"
        minHeight="sm"
        overlay="medium"
        blurBackground={true}
      />

      {/* Main Content */}
      <div className="container max-w-6xl py-10 space-y-8">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 mobile-text-xl">
              <Filter className="h-5 w-5 text-[hsl(218_31%_18%)]" />
              <span className="text-[hsl(218_31%_18%)]">Filter</span>{" "}
              <span className="bg-gradient-to-r from-[hsl(218_31%_18%)] via-[hsl(45_56%_55%)] to-[hsl(218_31%_18%)] bg-clip-text text-transparent">
                Announcements
              </span>
            </CardTitle>
            <CardDescription className="text-gray-600">
              Search and filter announcements to find what you're looking for.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search announcements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="event">Events</SelectItem>
                    <SelectItem value="schedule">Schedule Changes</SelectItem>
                    <SelectItem value="ministry">Ministry Updates</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Actions</Label>
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  className="w-full"
                >
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Quick Filters */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant={categoryFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter("all")}
            className="rounded-full"
          >
            All
          </Button>
          <Button
            variant={categoryFilter === "general" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter("general")}
            className="rounded-full"
          >
            <Bell className="h-4 w-4 mr-1" />
            General
          </Button>
          <Button
            variant={categoryFilter === "event" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter("event")}
            className="rounded-full"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Events
          </Button>
          <Button
            variant={categoryFilter === "schedule" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter("schedule")}
            className="rounded-full"
          >
            Schedule
          </Button>
          <Button
            variant={categoryFilter === "ministry" ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter("ministry")}
            className="rounded-full"
          >
            Ministry
          </Button>
        </div>

        {/* Announcements Display */}
        <div className="space-y-8">
          <Announcements
            key={`${refreshKey}-${searchTerm}-${categoryFilter}`}
            category={categoryFilter}
            variant="list"
            showHeader={false}
            className="space-y-6"
          />
        </div>

        {/* Information Section */}
        <Card className="relative overflow-hidden border-0 shadow-xl">
          {/* Background Image with Blur Effect */}
          <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url('/images/gallery/Church2.jpg')`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                filter: "blur(2px)",
                transform: "scale(1.05)",
              }}
          />

          {/* Enhanced overlay for readability with navy blue theme */}
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(218_31%_18%)]/85 via-[hsl(218_31%_18%)]/75 to-[hsl(218_31%_18%)]/90" />
          <div className="absolute inset-0 bg-[hsl(218_31%_18%)]/20" />

          <CardHeader className="relative z-10">
            <CardTitle className="text-white text-2xl drop-shadow-lg">
              Stay{" "}
              <span className="bg-gradient-to-r from-white via-[hsl(45_56%_55%)] to-white bg-clip-text text-transparent">
                Connected
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 md:min-h-[180px]">
              <div className="flex flex-col justify-between h-full">
                <div className="flex-1">
                  <h4 className="font-semibold mb-2 text-white drop-shadow-lg text-lg">
                    Want to receive announcements directly?
                  </h4>
                  <p className="text-gray-100 mb-4 drop-shadow-md">
                    Join our member portal to receive announcements via email and access exclusive member content.
                  </p>
                </div>
                <div className="mt-auto">
                  <Button variant="secondary" size="sm" className="bg-[hsl(45_56%_55%)] text-[hsl(218_31%_18%)] hover:bg-[hsl(45_56%_65%)] font-semibold shadow-lg" asChild>
                    <a href="/members/login">Member Login</a>
                  </Button>
                </div>
              </div>

              {/* Visual separator for larger screens */}
              <div className="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-24 bg-white/30" />

              <div className="flex flex-col justify-between h-full md:border-l md:border-white/20 md:pl-8">
                <div className="flex-1">
                  <h4 className="font-semibold mb-2 text-white drop-shadow-lg text-lg">
                    Have questions about an announcement?
                  </h4>
                  <p className="text-gray-100 mb-4 drop-shadow-md">
                    Feel free to contact our church office for more information about any announcement.
                  </p>
                </div>
                <div className="mt-auto">
                  <Button variant="secondary" size="sm" className="bg-[hsl(45_56%_55%)] text-[hsl(218_31%_18%)] hover:bg-[hsl(45_56%_65%)] font-semibold shadow-lg" asChild>
                    <a href="/contact">Contact Us</a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
