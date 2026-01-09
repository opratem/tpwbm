"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Plus,
  Clock,
  User,
  Heart as Praying,
  Calendar,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  Users,
  Timer
} from "lucide-react";
import { toast } from "sonner";
import {
  type PrayerRequest,
  PrayerRequestFormData,
  type PrayerRequestCategory,
  type PrayerRequestPriority,
  type PrayerRequestStatus,
  type PrayerRequestStats
} from "@/types/prayer-requests";

export default function AdminPrayerRequestsPage() {
  const { data: session } = useSession();
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<PrayerRequestCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<PrayerRequestStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<PrayerRequestPriority | "all">("all");
  const [selectedRequest, setSelectedRequest] = useState<PrayerRequest | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [stats, setStats] = useState<PrayerRequestStats>({
    total: 0,
    active: 0,
    answered: 0,
    pending: 0,
    thisWeek: 0,
    thisMonth: 0,
    totalPrayers: 0,
  });

  // Fetch prayer requests
  const fetchPrayerRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();

      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (priorityFilter !== "all") params.append("priority", priorityFilter);
      if (searchTerm) params.append("search", searchTerm);

      const response = await fetch(`/api/prayer-requests?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch prayer requests");

      const data = await response.json();
      setPrayerRequests(data);
      calculateStats(data);
    } catch (error) {
      console.error("Error fetching prayer requests:", error);
      toast.error("Failed to load prayer requests");
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter, statusFilter, priorityFilter, searchTerm]);

  // Calculate statistics
  const calculateStats = (requests: PrayerRequest[]) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const newStats: PrayerRequestStats = {
      total: requests.length,
      active: requests.filter(r => r.status === "active").length,
      answered: requests.filter(r => r.status === "answered").length,
      pending: requests.filter(r => r.status === "pending").length,
      thisWeek: requests.filter(r => new Date(r.createdAt) >= oneWeekAgo).length,
      thisMonth: requests.filter(r => new Date(r.createdAt) >= oneMonthAgo).length,
      totalPrayers: requests.reduce((sum, r) => sum + r.prayerCount, 0),
    };

    setStats(newStats);
  };

  // Update prayer request status
  const updateRequestStatus = async (requestId: string, status: PrayerRequestStatus, adminNotes?: string) => {
    try {
      const response = await fetch(`/api/prayer-requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, adminNotes }),
      });

      if (!response.ok) throw new Error("Failed to update prayer request");

      const updatedRequest = await response.json();
      setPrayerRequests(prev =>
          prev.map(request =>
              request.id === requestId ? updatedRequest : request
          )
      );

      toast.success("Prayer request status updated successfully!");
    } catch (error) {
      console.error("Error updating prayer request:", error);
      toast.error("Failed to update prayer request status");
    }
  };

  // Mark prayer request as answered
  const markAsAnswered = async (requestId: string, answeredDescription: string) => {
    try {
      const response = await fetch(`/api/prayer-requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "answered",
          answeredDate: new Date().toISOString(),
          answeredDescription,
        }),
      });

      if (!response.ok) throw new Error("Failed to mark prayer request as answered");

      const updatedRequest = await response.json();
      setPrayerRequests(prev =>
          prev.map(request =>
              request.id === requestId ? updatedRequest : request
          )
      );

      toast.success("Prayer request marked as answered!");
    } catch (error) {
      console.error("Error marking prayer request as answered:", error);
      toast.error("Failed to mark prayer request as answered");
    }
  };

  // Delete prayer request
  const deletePrayerRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/prayer-requests/${requestId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete prayer request");

      setPrayerRequests(prev => prev.filter(request => request.id !== requestId));
      toast.success("Prayer request deleted successfully!");
    } catch (error) {
      console.error("Error deleting prayer request:", error);
      toast.error("Failed to delete prayer request");
    }
  };

  // Get category color
  const getCategoryColor = (category: PrayerRequestCategory) => {
    const colors = {
      health: "bg-red-100 text-red-800",
      family: "bg-pink-100 text-pink-800",
      work: "bg-blue-100 text-blue-800",
      spiritual: "bg-purple-100 text-purple-800",
      financial: "bg-yellow-100 text-yellow-800",
      relationships: "bg-green-100 text-green-800",
      ministry: "bg-indigo-100 text-indigo-800",
      community: "bg-orange-100 text-orange-800",
      salvation: "bg-teal-100 text-teal-800",
      thanksgiving: "bg-emerald-100 text-emerald-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.other;
  };

  // Get priority color
  const getPriorityColor = (priority: PrayerRequestPriority) => {
    const colors = {
      urgent: "bg-red-100 text-red-800 border-red-200",
      high: "bg-orange-100 text-orange-800 border-orange-200",
      normal: "bg-blue-100 text-blue-800 border-blue-200",
      low: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[priority];
  };

  // Get status color
  const getStatusColor = (status: PrayerRequestStatus) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      active: "bg-green-100 text-green-800",
      answered: "bg-emerald-100 text-emerald-800",
      expired: "bg-gray-100 text-gray-800",
      archived: "bg-slate-100 text-slate-800",
    };
    return colors[status];
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  useEffect(() => {
    fetchPrayerRequests();
  }, [categoryFilter, statusFilter, priorityFilter, searchTerm, fetchPrayerRequests]);

  if (!session || (session.user.role !== "admin" && session.user.role !== "super_admin")) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-500">You don't have permission to access this page.</p>
          </div>
        </div>
    );
  }

  return (
      <AdminLayout>
        <div className="container max-w-7xl py-4 sm:py-6 md:py-10 px-4 sm:px-6 space-y-4 sm:space-y-6 md:space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Prayer Request Management</h1>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1 sm:mt-2">
                Manage and moderate prayer requests from church members
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4">
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total</p>
                    <p className="text-xl sm:text-2xl font-bold">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Active</p>
                    <p className="text-xl sm:text-2xl font-bold">{stats.active}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Answered</p>
                    <p className="text-xl sm:text-2xl font-bold">{stats.answered}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Pending</p>
                    <p className="text-xl sm:text-2xl font-bold">{stats.pending}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hidden sm:block">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">This Week</p>
                    <p className="text-xl sm:text-2xl font-bold">{stats.thisWeek}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hidden md:block">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">This Month</p>
                    <p className="text-xl sm:text-2xl font-bold">{stats.thisMonth}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hidden lg:block">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <Praying className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Prayers</p>
                    <p className="text-xl sm:text-2xl font-bold">{stats.totalPrayers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {/* Search */}
                <div className="relative sm:col-span-2 md:col-span-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                      placeholder="Search prayer requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 text-sm"
                  />
                </div>

                {/* Category Filter */}
                <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as PrayerRequestCategory | "all")}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="health">Health & Healing</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="work">Work & Career</SelectItem>
                    <SelectItem value="spiritual">Spiritual Growth</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="relationships">Relationships</SelectItem>
                    <SelectItem value="ministry">Ministry</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="salvation">Salvation</SelectItem>
                    <SelectItem value="thanksgiving">Thanksgiving</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PrayerRequestStatus | "all")}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="answered">Answered</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>

                {/* Priority Filter */}
                <Select value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as PrayerRequestPriority | "all")}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchPrayerRequests}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <span className="text-sm text-gray-500 text-center sm:text-left">
                {prayerRequests.length} prayer request{prayerRequests.length !== 1 ? "s" : ""}
              </span>
              </div>
            </CardContent>
          </Card>

          {/* Prayer Requests List */}
          {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
              </div>
          ) : (
              <div className="space-y-3 sm:space-y-4">
                {prayerRequests.map((request) => (
                    <Card key={request.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 sm:pt-6">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                          {/* Avatar - hidden on mobile */}
                          <Avatar className="h-10 w-10 hidden sm:block flex-shrink-0">
                            <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                              {request.isAnonymous
                                  ? "AN"
                                  : request.requestedBy.split(" ").map(n => n[0]).join("").slice(0, 2)
                              }
                            </div>
                          </Avatar>

                          <div className="flex-1 min-w-0 space-y-2">
                            {/* Header */}
                            <div className="flex flex-col gap-2">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                <h3 className="font-semibold text-sm sm:text-base truncate">{request.title}</h3>
                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 flex-shrink-0">
                                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                  {formatTimeAgo(request.createdAt)}
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                <span className="text-xs sm:text-sm font-medium">
                                  {request.isAnonymous ? "Anonymous" : request.requestedBy}
                                </span>
                                {request.requestedById === "00000000-0000-0000-0000-000000000000" && (
                                    <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                                      Guest
                                    </Badge>
                                )}
                                <Badge className={`${getCategoryColor(request.category)} text-xs`}>
                                  {request.category}
                                </Badge>
                                <Badge className={`${getPriorityColor(request.priority)} text-xs`}>
                                  {request.priority}
                                </Badge>
                                <Badge className={`${getStatusColor(request.status)} text-xs`}>
                                  {request.status}
                                </Badge>
                              </div>
                            </div>

                            {/* Content */}
                            <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                              {request.description}
                            </p>

                            {/* Tags */}
                            {request.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {request.tags.slice(0, 3).map((tag) => (
                                      <Badge key={tag} variant="outline" className="text-xs">
                                        #{tag}
                                      </Badge>
                                  ))}
                                  {request.tags.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{request.tags.length - 3} more
                                      </Badge>
                                  )}
                                </div>
                            )}

                            {/* Admin Notes */}
                            {request.adminNotes && (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded text-sm">
                                  <strong>Admin Notes:</strong> {request.adminNotes}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                                  {request.prayerCount} prayers
                                </span>
                                {request.expiresAt && (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                      <span className="hidden sm:inline">Expires</span> {new Date(request.expiresAt).toLocaleDateString()}
                                    </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                {request.status === "pending" && (
                                    <>
                                      <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => updateRequestStatus(request.id, "active")}
                                          className="text-xs sm:text-sm h-8"
                                      >
                                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                        <span className="hidden xs:inline">Approve</span>
                                      </Button>
                                      <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => updateRequestStatus(request.id, "archived", "Rejected by admin")}
                                          className="text-xs sm:text-sm h-8"
                                      >
                                        <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                        <span className="hidden xs:inline">Reject</span>
                                      </Button>
                                    </>
                                )}

                                {request.status === "active" && (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button size="sm" variant="outline" className="text-xs sm:text-sm h-8">
                                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                          <span className="hidden sm:inline">Mark</span> Answered
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col">
                                        <DialogHeader className="flex-shrink-0 pb-4 border-b">
                                          <DialogTitle>Mark Prayer as Answered</DialogTitle>
                                          <DialogDescription>
                                            Share how God has answered this prayer request.
                                          </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={(e) => {
                                          e.preventDefault();
                                          const formData = new FormData(e.currentTarget);
                                          const description = formData.get("description") as string;
                                          markAsAnswered(request.id, description);
                                        }} className="flex-1 flex flex-col overflow-hidden">
                                          <div className="flex-1 overflow-y-auto py-4 space-y-4">
                                            <div>
                                              <Label htmlFor="description">Answer Description</Label>
                                              <Textarea
                                                  id="description"
                                                  name="description"
                                                  placeholder="Describe how this prayer was answered..."
                                                  required
                                                  className="mt-2"
                                              />
                                            </div>
                                          </div>
                                          <DialogFooter className="flex-shrink-0 pt-4 border-t">
                                            <Button type="submit" className="w-full sm:w-auto">Mark as Answered</Button>
                                          </DialogFooter>
                                        </form>
                                      </DialogContent>
                                    </Dialog>
                                )}

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="outline" className="text-xs sm:text-sm h-8">
                                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                      <span className="hidden sm:inline">Delete</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Prayer Request</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this prayer request? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => deletePrayerRequest(request.id)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                ))}

                {/* Empty State */}
                {prayerRequests.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Praying className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No prayer requests found</h3>
                        <p className="text-gray-500">
                          {searchTerm || categoryFilter !== "all" || statusFilter !== "all" || priorityFilter !== "all"
                              ? "Try adjusting your filters to see more results"
                              : "No prayer requests have been submitted yet"
                          }
                        </p>
                      </CardContent>
                    </Card>
                )}
              </div>
          )}
        </div>
      </AdminLayout>
  );
}
