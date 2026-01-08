"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
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
  CheckCircle,
  Settings,
  Crown,
  Star,
  Camera,
  Upload,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface UserData {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  birthday: string | null;
  bio: string | null;
  image: string | null;
  role: string;
  interests?: string | null;
}

export default function AdminProfile() {
  const { data: session, status, update: updateSession } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    birthday: "",
    interests: "Administration, Church Management, Leadership",
    bio: "Church administrator with full system access and super user privileges.",
    image: session?.user?.image || "",
  });
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not authenticated or not admin/super_admin
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/members/login");
    }
    if (status === "authenticated" && session?.user?.role !== "admin" && session?.user?.role !== "super_admin") {
      redirect("/members/dashboard");
    }
  }, [status, session]);

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch("/api/admin/users");
          if (response.ok) {
            const data = await response.json();
            const currentUser = data.users?.find((user: UserData) => user.id === session.user.id);
            if (currentUser) {
              setFormData(prev => ({
                ...prev,
                name: currentUser.name || session.user.name || "",
                email: currentUser.email || session.user.email || "",
                phone: currentUser.phone || "",
                address: currentUser.address || "",
                birthday: currentUser.birthday ? new Date(currentUser.birthday).toISOString().split('T')[0] : "",
                interests: currentUser.interests || "Administration, Church Management, Leadership",
                bio: currentUser.bio || "Church administrator with full system access and super user privileges.",
                image: currentUser.image || session.user.image || "",
              }));
            }
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      }
      setLoading(false);
    };

    if (session?.user?.role === "admin" || session?.user?.role === "super_admin") {
      loadProfile();
    }
  }, [session]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size too large. Maximum size is 5MB.');
      return;
    }

    setUploadingImage(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('folder', 'profiles');
      formDataUpload.append('contentType', 'profile');
      formDataUpload.append('tags', 'profile,admin');

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Failed to upload image');
      }

      const uploadResult = await uploadResponse.json();

      // Update form data with new image URL
      setFormData(prev => ({ ...prev, image: uploadResult.url }));

      // Immediately save the profile with new image
      const updateResponse = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          image: uploadResult.url,
        }),
      });

      if (updateResponse.ok) {
        toast.success('Profile picture updated successfully!');
        // Update session to reflect new image
        await updateSession({ image: uploadResult.url });
      } else {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);

        // Reload the profile data to reflect changes
        const profileResponse = await fetch("/api/admin/users");
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const currentUser = profileData.users?.find((user: UserData) => user.id === session?.user?.id);
          if (currentUser) {
            setFormData(prev => ({
              ...prev,
              name: currentUser.name || "",
              email: currentUser.email || "",
              phone: currentUser.phone || "",
              address: currentUser.address || "",
              birthday: currentUser.birthday ? new Date(currentUser.birthday).toISOString().split('T')[0] : "",
              interests: currentUser.interests || "Administration, Church Management, Leadership",
              bio: currentUser.bio || "Church administrator with full system access and super user privileges.",
              image: currentUser.image || "",
            }));
          }
        }

        // Update session data if needed
        if (session?.user) {
          await updateSession({ name: formData.name, image: formData.image });
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
          const currentUser = data.users?.find((user: UserData) => user.id === session.user.id);
          if (currentUser) {
            setFormData(prev => ({
              ...prev,
              name: currentUser.name || "",
              email: currentUser.email || "",
              phone: currentUser.phone || "",
              address: currentUser.address || "",
              birthday: currentUser.birthday ? new Date(currentUser.birthday).toISOString().split('T')[0] : "",
              interests: currentUser.interests || "Administration, Church Management, Leadership",
              bio: currentUser.bio || "Church administrator with full system access and super user privileges.",
              image: currentUser.image || "",
            }));
          }
        }
      } catch (error) {
        console.error("Error resetting form:", error);
      }
    }
    setIsEditing(false);
  };

  const isSuperAdmin = session?.user?.role === "super_admin";

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading admin profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (session.user.role !== "admin" && session.user.role !== "super_admin") {
    return null;
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/50 to-red-50/50 dark:from-gray-900 dark:via-orange-900/10 dark:to-gray-900">
        <div className="container max-w-5xl py-8 space-y-8">
          {/* Modern Header */}
          <div className="relative">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-red-600/10 to-pink-600/10 rounded-3xl blur-3xl" />

            <Card className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <Avatar className="h-20 w-20 ring-4 ring-white/50 dark:ring-gray-700/50 shadow-lg overflow-hidden">
                        {formData.image ? (
                          <Image
                            src={formData.image}
                            alt={formData.name || "Profile"}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full ${isSuperAdmin ? 'bg-gradient-to-br from-amber-500 to-amber-600' : 'bg-gradient-to-br from-orange-500 to-red-600'} flex items-center justify-center text-2xl font-bold text-white`}>
                            {session.user.name?.charAt(0)}
                          </div>
                        )}
                      </Avatar>
                      {/* Profile picture upload overlay */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer disabled:cursor-wait"
                      >
                        {uploadingImage ? (
                          <Loader2 className="h-6 w-6 text-white animate-spin" />
                        ) : (
                          <Camera className="h-6 w-6 text-white" />
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className={`absolute -bottom-1 -right-1 h-6 w-6 ${isSuperAdmin ? 'bg-amber-500' : 'bg-green-500'} border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center`}>
                        <Crown className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{formData.name || session.user.name}</h1>
                        <Badge
                          variant="destructive"
                          className={`px-3 py-1 gap-1 ${isSuperAdmin ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
                        >
                          <Shield className="h-3 w-3" />
                          {isSuperAdmin ? "Super Admin" : "Administrator"}
                        </Badge>
                        {isSuperAdmin && (
                          <Badge variant="outline" className="px-3 py-1 gap-1 border-amber-500 text-amber-600">
                            <Star className="h-3 w-3" />
                            Elevated Access
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Full system access • All permissions granted
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Hover over profile picture to change it
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {!isEditing ? (
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        className="gap-2 hover:bg-orange-50 hover:border-orange-300"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={handleSave}
                          variant="outline"
                          className="gap-2 hover:bg-green-50 hover:border-green-300 text-green-600"
                        >
                          <Save className="h-4 w-4" />
                          Save Changes
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="gap-2 hover:bg-red-50 hover:border-red-300 text-red-600"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-orange-600" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Your basic admin account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                    className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                    className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Add your phone number"
                    className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Add your address"
                    className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthday" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Birthday
                  </Label>
                  <Input
                    id="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => setFormData(prev => ({ ...prev, birthday: e.target.value }))}
                    disabled={!isEditing}
                    className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-red-600" />
                  Administrative Details
                </CardTitle>
                <CardDescription>
                  Your administrative responsibilities and interests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="interests" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Areas of Responsibility
                  </Label>
                  <Input
                    id="interests"
                    value={formData.interests}
                    onChange={(e) => setFormData(prev => ({ ...prev, interests: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="e.g., Administration, Leadership, Management"
                    className="transition-all duration-200 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Tell us about your role and responsibilities..."
                    className="transition-all duration-200 focus:ring-2 focus:ring-orange-500 resize-none"
                  />
                </div>

                {/* Admin Stats */}
                <div className="pt-6 border-t">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    Admin Privileges
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Full Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">User Management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Content Control</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">System Settings</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
