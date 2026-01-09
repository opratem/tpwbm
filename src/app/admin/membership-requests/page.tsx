"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  UserPlus,
  Search,
  Check,
  X,
  Eye,
  Trash2,
  RefreshCw,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

interface MembershipRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  birthDate: string | null;
  interests: string | null;
  previousChurch: string | null;
  referredBy: string | null;
  additionalInfo: string | null;
  status: "pending" | "approved" | "rejected" | "cancelled";
  reviewedBy: string | null;
  reviewedAt: Date | null;
  reviewNotes: string | null;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function MembershipRequestsPage() {
  const { data: session, status } = useSession();
  const [requests, setRequests] = useState<MembershipRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<MembershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<MembershipRequest | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/members/login");
    }
  }, [status]);

  useEffect(() => {
    if (session?.user.role === "admin" || session?.user.role === "super_admin") {
      fetchRequests();
    }
  }, [session]);

  useEffect(() => {
    filterRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests, searchTerm, statusFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/members/register');

      if (!response.ok) throw new Error('Failed to fetch requests');

      const data = await response.json();
      setRequests(data);
    } catch (error) {
      toast.error("Failed to load membership requests");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...requests];

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(req =>
        req.firstName.toLowerCase().includes(term) ||
        req.lastName.toLowerCase().includes(term) ||
        req.email.toLowerCase().includes(term) ||
        (req.phone && req.phone.toLowerCase().includes(term))
      );
    }

    setFilteredRequests(filtered);
  };

  const handleReview = async () => {
    if (!selectedRequest || !reviewAction) return;

    try {
      setProcessing(true);
      const response = await fetch(`/api/members/register/${selectedRequest.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: reviewAction,
          reviewNotes,
          // Only send password if admin actually entered one (for override)
          // Empty string should not be sent - let the API use the user's chosen password
          password: reviewAction === 'approve' && tempPassword?.trim() ? tempPassword.trim() : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process request');
      }

      toast.success(data.message);

      if (reviewAction === 'approve') {
        if (data.user?.tempPassword) {
          // Admin provided override password
          toast.success(`Override password set: ${data.user.tempPassword}`, {
            description: "Send this password to the user securely",
            duration: 10000,
          });
        } else {
          // Using user's original password
          toast.success("User can login with their chosen password", {
            description: "The password they entered during registration will work",
            duration: 6000,
          });
        }
      }

      setReviewDialogOpen(false);
      setSelectedRequest(null);
      setReviewNotes("");
      setTempPassword("");
      setReviewAction(null);
      fetchRequests();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to process request";
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    try {
      const response = await fetch(`/api/members/register/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete request');

      toast.success('Request deleted successfully');
      fetchRequests();
    } catch (error) {
      toast.error("Failed to delete request");
    }
  };

  const openReviewDialog = (request: MembershipRequest, action: "approve" | "reject") => {
    setSelectedRequest(request);
    setReviewAction(action);
    setReviewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: React.ReactElement }> = {
      pending: { variant: "outline", icon: <Clock className="h-3 w-3" /> },
      approved: { variant: "default", icon: <CheckCircle className="h-3 w-3" /> },
      rejected: { variant: "destructive", icon: <XCircle className="h-3 w-3" /> },
      cancelled: { variant: "secondary", icon: <AlertCircle className="h-3 w-3" /> },
    };

    const { variant, icon } = variants[status] || variants.pending;

    return (
      <Badge variant={variant} className="flex items-center gap-1 w-fit">
        {icon}
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  if (status === "loading" || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (session.user.role !== "admin" && session.user.role !== "super_admin") {
    redirect("/");
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-4 sm:py-6 md:py-8 px-4 sm:px-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <UserPlus className="h-6 w-6 sm:h-8 sm:w-8" />
          Membership Requests
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
          Review and manage membership registration requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Total Requests</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Pending</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl text-yellow-600">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Approved</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl text-green-600">{stats.approved}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-6">
            <CardDescription className="text-xs sm:text-sm">Rejected</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl text-red-600">{stats.rejected}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="p-3 sm:p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[150px] text-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Requests</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={fetchRequests} variant="outline" size="icon" className="flex-shrink-0">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No membership requests found
            </div>
          ) : (
            <>
            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-3">
              {filteredRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{request.firstName} {request.lastName}</p>
                      <p className="text-sm text-muted-foreground break-all">{request.email}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{request.phone || "No phone"}</span>
                    <span>{format(new Date(request.createdAt), "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedRequest(request);
                        setViewDialogOpen(true);
                      }}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {request.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => openReviewDialog(request, "approve")}
                          className="flex-1"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openReviewDialog(request, "reject")}
                          className="flex-1"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {request.status !== "pending" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(request.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden lg:table-cell">Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        <div>
                          {request.firstName} {request.lastName}
                          <span className="md:hidden block text-xs text-muted-foreground break-all">{request.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{request.email}</TableCell>
                      <TableCell className="hidden lg:table-cell">{request.phone || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {format(new Date(request.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedRequest(request);
                              setViewDialogOpen(true);
                            }}
                            className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {request.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => openReviewDialog(request, "approve")}
                                className="h-8 px-2 sm:h-9 sm:px-3"
                              >
                                <Check className="h-4 w-4 sm:mr-1" />
                                <span className="hidden sm:inline">Approve</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => openReviewDialog(request, "reject")}
                                className="h-8 px-2 sm:h-9 sm:px-3"
                              >
                                <X className="h-4 w-4 sm:mr-1" />
                                <span className="hidden sm:inline">Reject</span>
                              </Button>
                            </>
                          )}
                          {request.status !== "pending" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(request.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0 pb-4 border-b">
            <DialogTitle>Membership Request Details</DialogTitle>
            <DialogDescription>
              Review the complete information for this membership request
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="flex-1 overflow-y-auto py-2 -mx-4 px-4 sm:-mx-0 sm:px-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs sm:text-sm">First Name</Label>
                  <p className="font-medium text-sm sm:text-base">{selectedRequest.firstName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs sm:text-sm">Last Name</Label>
                  <p className="font-medium text-sm sm:text-base">{selectedRequest.lastName}</p>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <Label className="text-muted-foreground text-xs sm:text-sm flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email
                  </Label>
                  <p className="font-medium text-sm sm:text-base break-all">{selectedRequest.email}</p>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <Label className="text-muted-foreground text-xs sm:text-sm flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Phone
                  </Label>
                  <p className="font-medium text-sm sm:text-base">{selectedRequest.phone || "N/A"}</p>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <Label className="text-muted-foreground text-xs sm:text-sm flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Address
                  </Label>
                  <p className="font-medium text-sm sm:text-base">
                    {selectedRequest.address || "N/A"}
                    {selectedRequest.city && `, ${selectedRequest.city}`}
                    {selectedRequest.state && `, ${selectedRequest.state}`}
                    {selectedRequest.zipCode && ` ${selectedRequest.zipCode}`}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs sm:text-sm flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Birth Date
                  </Label>
                  <p className="font-medium text-sm sm:text-base">{selectedRequest.birthDate || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs sm:text-sm">Status</Label>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                {selectedRequest.interests && (
                  <div className="col-span-1 sm:col-span-2">
                    <Label className="text-muted-foreground text-xs sm:text-sm">Interests/Ministries</Label>
                    <p className="font-medium text-sm sm:text-base">{selectedRequest.interests}</p>
                  </div>
                )}
                {selectedRequest.previousChurch && (
                  <div className="col-span-1 sm:col-span-2">
                    <Label className="text-muted-foreground text-xs sm:text-sm">Previous Church</Label>
                    <p className="font-medium text-sm sm:text-base">{selectedRequest.previousChurch}</p>
                  </div>
                )}
                {selectedRequest.referredBy && (
                  <div className="col-span-1 sm:col-span-2">
                    <Label className="text-muted-foreground text-xs sm:text-sm">Referred By</Label>
                    <p className="font-medium text-sm sm:text-base">{selectedRequest.referredBy}</p>
                  </div>
                )}
                {selectedRequest.additionalInfo && (
                  <div className="col-span-1 sm:col-span-2">
                    <Label className="text-muted-foreground text-xs sm:text-sm">Additional Information</Label>
                    <p className="font-medium text-sm sm:text-base">{selectedRequest.additionalInfo}</p>
                  </div>
                )}
                {selectedRequest.reviewNotes && (
                  <div className="col-span-1 sm:col-span-2">
                    <Label className="text-muted-foreground text-xs sm:text-sm">Review Notes</Label>
                    <p className="font-medium text-sm sm:text-base italic">{selectedRequest.reviewNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="flex-shrink-0 pt-4 border-t">
            <Button variant="outline" onClick={() => setViewDialogOpen(false)} className="w-full sm:w-auto">
              Close
            </Button>
            {selectedRequest?.status === "pending" && (
              <>
                <Button
                  variant="default"
                  onClick={() => {
                    setViewDialogOpen(false);
                    openReviewDialog(selectedRequest, "approve");
                  }}
                  className="w-full sm:w-auto"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setViewDialogOpen(false);
                    openReviewDialog(selectedRequest, "reject");
                  }}
                  className="w-full sm:w-auto"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0 pb-4 border-b">
            <DialogTitle className="text-lg sm:text-xl">
              {reviewAction === "approve" ? "Approve" : "Reject"} Membership Request
            </DialogTitle>
            <DialogDescription className="text-sm">
              {reviewAction === "approve"
                ? "This will create a new user account and grant member access."
                : "This will reject the membership request."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {reviewAction === "approve" && (
              <div className="space-y-2">
                <Label htmlFor="tempPassword" className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                  <span>Override Password (optional)</span>
                  <span className="text-xs font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded w-fit">User already set a password</span>
                </Label>
                <Input
                  id="tempPassword"
                  type="text"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  placeholder="Leave empty to use their chosen password"
                  className="text-sm"
                />
                <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                  <p className="font-medium text-green-600">The user chose their password during registration</p>
                  <p>Only enter a new password here if you need to override their choice.</p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="reviewNotes" className="text-sm">
                Review Notes (optional)
              </Label>
              <Textarea
                id="reviewNotes"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add any notes about your decision..."
                rows={3}
                className="text-sm resize-none"
              />
            </div>
          </div>
          <DialogFooter className="flex-shrink-0 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setReviewDialogOpen(false);
                setReviewNotes("");
                setTempPassword("");
              }}
              disabled={processing}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant={reviewAction === "approve" ? "default" : "destructive"}
              onClick={handleReview}
              disabled={processing}
              className="w-full sm:w-auto"
            >
              {processing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : reviewAction === "approve" ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <X className="h-4 w-4 mr-2" />
              )}
              <span className="text-sm">{reviewAction === "approve" ? "Approve & Create Account" : "Reject Request"}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </AdminLayout>
  );
}
