"use client";

import { useState, useEffect } from "react";
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
import { Avatar } from "@/components/ui/avatar";
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
  Crown
} from "lucide-react";
import { toast } from "sonner";

export default function MemberProfile() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    birthday: "",
    interests: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "",
        address: "",
        birthday: "",
        interests: "",
        bio: "",
      });
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
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-church-accent/30 shadow-lg">
                  <div className="w-full h-full bg-gradient-to-br from-church-primary to-church-primary-light flex items-center justify-center text-3xl font-bold text-white">
                    {getUserInitials()}
                  </div>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-church-accent border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
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
                      disabled={saving}
                      className="gap-2 bg-church-accent hover:bg-church-accent/90"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      disabled={saving}
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
