"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Edit,
  Save,
  X,
  Shield,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

export default function MemberProfile() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    birthday: "",
    interests: "Bible Study, Worship, Community Outreach",
    bio: "I've been a member of this church family for 3 years and love serving in the children's ministry.",
  });
  const [loading, setLoading] = useState(true);

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (session?.user?.id) {
        try {
          setLoading(true);
          const response = await fetch("/api/admin/users");
          if (response.ok) {
            const data = await response.json();
            const currentUser = data.users?.find((user: any) => user.id === session.user.id);
            if (currentUser) {
              setFormData(prev => ({
                ...prev,
                name: currentUser.name || "",
                email: currentUser.email || "",
                phone: currentUser.phone || "",
                address: currentUser.address || "",
                birthday: currentUser.birthday ? new Date(currentUser.birthday).toISOString().split('T')[0] : "",
                interests: currentUser.interests || "Bible Study, Worship, Community Outreach",
                bio: currentUser.bio || "I've been a member of this church family for 3 years and love serving in the children's ministry.",
              }));
            }
          }
        } catch (error) {
          console.error("Error loading profile:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadProfile();
  }, [session?.user?.id]);

  const handleSave = async () => {
    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          birthday: formData.birthday,
          interests: formData.interests,
          bio: formData.bio,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);

        // Reload the profile data to reflect changes
        const profileResponse = await fetch("/api/admin/users");
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const currentUser = profileData.users?.find((user: any) => user.id === session?.user?.id);
          if (currentUser) {
            setFormData(prev => ({
              ...prev,
              name: currentUser.name || "",
              email: currentUser.email || "",
              phone: currentUser.phone || "",
              address: currentUser.address || "",
              birthday: currentUser.birthday ? new Date(currentUser.birthday).toISOString().split('T')[0] : "",
              interests: currentUser.interests || "Bible Study, Worship, Community Outreach",
              bio: currentUser.bio || "I've been a member of this church family for 3 years and love serving in the children's ministry.",
            }));
          }
        }

        // Update session data if needed
        if (session?.user) {
          session.user.name = formData.name;
        }
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  };

  const handleCancel = async () => {
    // Reset form to original values by reloading from database
    if (session?.user?.id) {
      try {
        const response = await fetch("/api/admin/users");
        if (response.ok) {
          const data = await response.json();
          const currentUser = data.users?.find((user: any) => user.id === session.user.id);
          if (currentUser) {
            setFormData(prev => ({
              ...prev,
              name: currentUser.name || "",
              email: currentUser.email || "",
              phone: currentUser.phone || "",
              address: currentUser.address || "",
              birthday: currentUser.birthday ? new Date(currentUser.birthday).toISOString().split('T')[0] : "",
              interests: currentUser.interests || "Bible Study, Worship, Community Outreach",
              bio: currentUser.bio || "I've been a member of this church family for 3 years and love serving in the children's ministry.",
            }));
          }
        }
      } catch (error) {
        console.error("Error resetting form:", error);
      }
    }
    setIsEditing(false);
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-900">
      <div className="container max-w-5xl py-8 space-y-8">
        {/* Modern Header */}
        <div className="relative">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-3xl blur-3xl" />

          <Card className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20 ring-4 ring-white/50 dark:ring-gray-700/50 shadow-lg">
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                        {session.user.name?.charAt(0)}
                      </div>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-400">{session.user.name}</h1>
                      <Badge
                        variant={session.user.role === 'admin' ? 'destructive' : 'secondary'}
                        className="px-3 py-1 gap-1"
                      >
                        {session.user.role === 'admin' ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                        {session.user.role === 'admin' ? 'Administrator' : 'Member'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {session.user.email}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Member since 2021
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        Active Member
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {isEditing ? (
                    <div>
                      <Button onClick={handleSave} size="sm" className="gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm" className="gap-2">
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Your contact details for church communications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="transition-all duration-200"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg border">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{formData.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg border">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{formData.email}</span>
                      <Badge variant="outline" className="ml-auto text-xs">Verified</Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="Enter your phone number"
                        className="transition-all duration-200"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg border">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{formData.phone || "Not provided"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthday" className="text-sm font-medium">Birthday</Label>
                    {isEditing ? (
                      <Input
                        id="birthday"
                        type="date"
                        value={formData.birthday}
                        onChange={(e) =>
                          setFormData({ ...formData, birthday: e.target.value })
                        }
                        className="transition-all duration-200"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg border">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">
                          {formData.birthday ? new Date(formData.birthday).toLocaleDateString() : "Not provided"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                  {isEditing ? (
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      rows={2}
                      placeholder="Enter your address"
                      className="transition-all duration-200"
                    />
                  ) : (
                    <div className="flex items-start gap-3 p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg border">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span className="font-medium">{formData.address || "Not provided"}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-purple-600" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Tell us more about yourself and your interests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="interests" className="text-sm font-medium">Interests & Ministries</Label>
                  {isEditing ? (
                    <Input
                      id="interests"
                      value={formData.interests}
                      onChange={(e) =>
                        setFormData({ ...formData, interests: e.target.value })
                      }
                      placeholder="e.g., Bible Study, Worship, Youth Ministry"
                      className="transition-all duration-200"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.split(", ").map((interest, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      rows={4}
                      placeholder="Tell us about yourself, your faith journey, or how you serve in the church..."
                      className="transition-all duration-200"
                    />
                  ) : (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200/50 dark:border-blue-700/50">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {formData.bio}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <Calendar className="h-4 w-4" />
                  View Events
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                  <Heart className="h-4 w-4" />
                  Prayer Requests
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 hover:bg-green-50 dark:hover:bg-green-900/20">
                  <User className="h-4 w-4" />
                  Member Directory
                </Button>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Account Status</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Email Verified</span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Member Since</span>
                  <span className="text-sm font-medium">2021</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
