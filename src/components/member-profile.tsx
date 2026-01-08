"use client";

import { useState, useEffect, useRef } from "react";
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
  Camera,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function MemberProfile() {
  const { data: session, update: updateSession } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    birthday: "",
    interests: "Bible Study, Worship, Community Outreach",
    bio: "I've been a member of this church family for 3 years and love serving in the children's ministry.",
    image: session?.user?.image || "",
  });
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
                image: currentUser.image || session.user.image || "",
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
      formDataUpload.append('tags', 'profile,member');

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
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
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
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          image: formData.image,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        // Update session
        await updateSession({ name: formData.name, image: formData.image });
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    }
  };

  const handleCancel = () => {
    // Reset form to original values - now using session data instead of hardcoded
    setFormData(prev => ({
      ...prev,
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    }));
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
    <div className="container max-w-4xl py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage your personal information and preferences
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="h-24 w-24 overflow-hidden">
                {formData.image ? (
                  <Image
                    src={formData.image}
                    alt={formData.name || "Profile"}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center text-2xl font-semibold text-blue-600">
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
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold">{formData.name || session.user.name}</h2>
                <Badge variant="secondary">{session.user.role}</Badge>
              </div>
              <p className="text-gray-500">{session.user.email}</p>
              <p className="text-sm text-gray-400">Hover over profile picture to change it</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Member since 2021
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  Active Member
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Your contact details for church communications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              ) : (
                <div className="flex items-center gap-2 p-2 border rounded">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{formData.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              ) : (
                <div className="flex items-center gap-2 p-2 border rounded">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{formData.email}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              ) : (
                <div className="flex items-center gap-2 p-2 border rounded">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{formData.phone || "Not set"}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthday">Birthday</Label>
              {isEditing ? (
                <Input
                  id="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={(e) =>
                    setFormData({ ...formData, birthday: e.target.value })
                  }
                />
              ) : (
                <div className="flex items-center gap-2 p-2 border rounded">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{formData.birthday ? new Date(formData.birthday).toLocaleDateString() : "Not set"}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            {isEditing ? (
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                rows={2}
              />
            ) : (
              <div className="flex items-start gap-2 p-2 border rounded">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <span>{formData.address || "Not set"}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Tell us more about yourself and your interests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="interests">Interests & Ministries</Label>
            {isEditing ? (
              <Input
                id="interests"
                value={formData.interests}
                onChange={(e) =>
                  setFormData({ ...formData, interests: e.target.value })
                }
                placeholder="e.g., Bible Study, Worship, Youth Ministry"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.interests.split(", ").map((interest, index) => (
                  <Badge key={index} variant="outline">
                    {interest}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                rows={4}
                placeholder="Tell us about yourself, your faith journey, or how you serve in the church..."
              />
            ) : (
              <p className="p-3 border rounded bg-gray-50 dark:bg-gray-900">
                {formData.bio}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Member Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Member Statistics</CardTitle>
          <CardDescription>Your engagement and participation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-gray-500">Services Attended</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-green-600">23</div>
              <div className="text-sm text-gray-500">Events Joined</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-purple-600">8</div>
              <div className="text-sm text-gray-500">Prayer Requests</div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-gray-500">Years Member</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
