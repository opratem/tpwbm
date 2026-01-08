"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
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
  Users,
  Crown,
  Camera,
  Upload,
  Trash2,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function MemberProfile() {
  const { data: session, status, update: updateSession } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthday: "",
    interests: "",
    bio: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/members/login");
    }
  }, [status]);

  useEffect(() => {
    const loadProfile = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch("/api/profile");
          if (response.ok) {
            const data = await response.json();
            if (data.user) {
              setFormData({
                name: data.user.name || session.user.name || "",
                email: data.user.email || session.user.email || "",
                phone: data.user.phone || "",
                address: data.user.address || "",
                birthday: data.user.birthday ? new Date(data.user.birthday).toISOString().split('T')[0] : "",
                interests: data.user.interests || "",
                bio: data.user.bio || "",
                image: data.user.image || session.user.image || "",
              });
            }
          } else {
            setFormData({
              name: session.user.name || "",
              email: session.user.email || "",
              phone: "",
              address: "",
              birthday: "",
              interests: "",
              bio: "",
              image: session.user.image || "",
            });
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          setFormData({
            name: session.user.name || "",
            email: session.user.email || "",
            phone: "",
            address: "",
            birthday: "",
            interests: "",
            bio: "",
            image: session.user.image || "",
          });
        }
      }
      setLoading(false);
    };

    if (session?.user) {
      loadProfile();
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size too large. Maximum size is 5MB.');
      return;
    }

    setUploadingImage(true);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('folder', 'profile_pictures');
      uploadData.append('contentType', 'profile');
      uploadData.append('tags', 'profile,member');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          image: data.url,
        }));
        toast.success('Profile picture uploaded! Click "Save" to apply changes.');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('An error occurred while uploading your image');
    } finally {
      setUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: "",
    }));
    toast.info('Profile picture removed. Click "Save" to apply changes.');
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        // Update the session to reflect the new image
        if (updateSession) {
          await updateSession({
            ...session,
            user: {
              ...session?.user,
              name: formData.name,
              image: formData.image,
            }
          });
        }
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update profile");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("An error occurred while updating your profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (session?.user) {
      // Reload profile data
      const loadProfile = async () => {
        try {
          const response = await fetch("/api/profile");
          if (response.ok) {
            const data = await response.json();
            if (data.user) {
              setFormData({
                name: data.user.name || session.user.name || "",
                email: data.user.email || session.user.email || "",
                phone: data.user.phone || "",
                address: data.user.address || "",
                birthday: data.user.birthday ? new Date(data.user.birthday).toISOString().split('T')[0] : "",
                interests: data.user.interests || "",
                bio: data.user.bio || "",
                image: data.user.image || session.user.image || "",
              });
            }
          }
        } catch (error) {
          console.error('Error reloading profile:', error);
        }
      };
      loadProfile();
    }
  };

  const getUserInitials = () => {
    if (!session?.user?.name || typeof session.user.name !== 'string' || session.user.name.trim() === '') {
      return session?.user?.email?.[0]?.toUpperCase() || 'U';
    }
    try {
      const names = session.user.name.trim().split(' ').filter(word => word.length > 0);
      if (names.length >= 2) {
        return names[0][0] + names[names.length - 1][0];
      }
      if (names.length === 1 && names[0].length > 0) {
        return names[0][0];
      }
      return session?.user?.email?.[0]?.toUpperCase() || 'U';
    } catch (error) {
      console.error('Error getting user initials:', error);
      return session?.user?.email?.[0]?.toUpperCase() || 'U';
    }
  };

  const formatMinistryRole = (role: string | null | undefined) => {
    if (!role || typeof role !== 'string' || role.trim().length === 0) return '';
    try {
      return role.trim().split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    } catch (error) {
      console.error('Error formatting ministry role:', error);
      return '';
    }
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-church-primary mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <Breadcrumbs />

      <div className="container max-w-4xl py-8 space-y-6">
        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border border-church-primary/10 shadow-xl">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 ring-4 ring-church-accent/30 shadow-lg">
                  {formData.image ? (
                    <AvatarImage src={formData.image} alt={formData.name || "Profile"} />
                  ) : null}
                  <AvatarFallback className="bg-gradient-to-br from-church-primary to-church-primary-light text-3xl font-bold text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-church-accent border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>

                {/* Profile Picture Edit Overlay */}
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="hidden"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-church-primary dark:text-white mb-2">
                  {session.user.name || 'Member'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{session.user.email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge
                    variant="secondary"
                    className={`gap-1 ${session.user.role === 'super_admin' ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0' : ''}`}
                  >
                    {session.user.role === 'super_admin' ? <Crown className="h-3 w-3" /> : session.user.role === 'admin' ? <Shield className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                    {session.user.role === 'super_admin' ? 'Super Admin' : session.user.role === 'admin' ? 'Administrator' : 'Member'}
                  </Badge>
                  {session.user.ministryRole && (
                    <Badge variant="outline" className="border-church-accent text-church-accent gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatMinistryRole(session.user.ministryRole)}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="gap-2 bg-church-primary hover:bg-church-primary/90"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={saving || uploadingImage}
                      className="gap-2 bg-church-accent hover:bg-church-accent/90"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      disabled={saving || uploadingImage}
                      className="gap-2"
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

        {/* Profile Picture Upload Section - Only visible when editing */}
        {isEditing && (
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border border-church-primary/10 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-church-primary dark:text-white">
                <Camera className="h-5 w-5" />
                Profile Picture
              </CardTitle>
              <CardDescription>
                Upload a profile picture to personalize your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Current Profile Picture Preview */}
                <div className="relative">
                  <Avatar className="h-20 w-20 ring-2 ring-gray-200 dark:ring-gray-700">
                    {formData.image ? (
                      <AvatarImage src={formData.image} alt="Profile preview" />
                    ) : null}
                    <AvatarFallback className="bg-gradient-to-br from-church-primary to-church-primary-light text-2xl font-bold text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Upload Photo
                        </>
                      )}
                    </Button>
                    {formData.image && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-red-500 hover:text-red-700 hover:border-red-300"
                        onClick={handleRemoveImage}
                        disabled={uploadingImage}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Accepted formats: JPEG, PNG, WebP. Max size: 5MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border border-church-primary/10 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-church-primary dark:text-white">
              <Settings className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-white dark:bg-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-white dark:bg-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="(555) 123-4567"
                className="bg-white dark:bg-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                Address
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="123 Main St, City, State"
                className="bg-white dark:bg-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthday" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                Birthday
              </Label>
              <Input
                id="birthday"
                name="birthday"
                type="date"
                value={formData.birthday}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-white dark:bg-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests" className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-gray-500" />
                Interests & Hobbies
              </Label>
              <Input
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="e.g., Music, Reading, Sports"
                className="bg-white dark:bg-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Tell us a little about yourself..."
                rows={4}
                className="bg-white dark:bg-gray-800 resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
