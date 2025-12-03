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
  CheckCircle,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  birthday: string | null;
  interests: string | null;
  bio: string | null;
  role: string;
  ministryRole: string | null;
  ministryLevel: string | null;
  ministryStartDate: string | null;
  ministryDescription: string | null;
  membershipDate: string | null;
  isActive: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function MemberProfile() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    birthday: "",
    interests: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load user profile data from dedicated endpoint
  useEffect(() => {
    const loadProfile = async () => {
      if (session?.user?.id) {
        try {
          setLoading(true);
          const response = await fetch("/api/profile/update");
          if (response.ok) {
            const data = await response.json();
            const userProfile = data.profile;
            setProfile(userProfile);
            setFormData({
              name: userProfile.name || "",
              phone: userProfile.phone || "",
              address: userProfile.address || "",
              birthday: userProfile.birthday ? new Date(userProfile.birthday).toISOString().split('T')[0] : "",
              interests: userProfile.interests || "",
              bio: userProfile.bio || "",
            });
          } else {
            toast.error("Failed to load profile");
          }
        } catch (error) {
          console.error("Error loading profile:", error);
          toast.error("Error loading profile");
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
      setSaving(true);
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);

        // Reload the profile data to reflect changes
        const profileResponse = await fetch("/api/profile/update");
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile(profileData.profile);
          setFormData({
            name: profileData.profile.name || "",
            phone: profileData.profile.phone || "",
            address: profileData.profile.address || "",
            birthday: profileData.profile.birthday ? new Date(profileData.profile.birthday).toISOString().split('T')[0] : "",
            interests: profileData.profile.interests || "",
            bio: profileData.profile.bio || "",
          });
        }
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original profile values
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        birthday: profile.birthday ? new Date(profile.birthday).toISOString().split('T')[0] : "",
        interests: profile.interests || "",
        bio: profile.bio || "",
      });
    }
    setIsEditing(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatMinistryRole = (role: string | null) => {
    if (!role) return null;
    return role.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatMinistryLevel = (level: string | null) => {
    if (!level) return null;
    return level.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-church-primary" />
          <p className="text-church-text-muted">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
            <CardDescription>Unable to load your profile information.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/20">
      <div className="container max-w-5xl py-8 space-y-8">
        {/* Modern Header */}
        <div className="relative">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-r from-church-primary/10 via-church-accent/10 to-church-primary/10 rounded-3xl blur-3xl" />

          <Card className="relative backdrop-blur-sm bg-white/80 border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20 ring-4 ring-church-accent/20 shadow-lg">
                      {profile.image ? (
                        <img src={profile.image} alt={profile.name || 'User'} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-church-primary via-church-primary-light to-church-accent flex items-center justify-center text-2xl font-bold text-white">
                          {profile.name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </Avatar>
                    {profile.isActive && (
                      <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-church-accent border-2 border-white rounded-full flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-xl md:text-2xl font-bold text-church-primary">{profile.name || 'No Name'}</h1>
                      <Badge
                        variant={profile.role === 'admin' ? 'default' : 'secondary'}
                        className={profile.role === 'admin' ? 'px-3 py-1 gap-1 bg-church-accent text-church-primary hover:bg-church-accent/90' : 'px-3 py-1 gap-1'}
                      >
                        {profile.role === 'admin' ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                        {profile.role === 'admin' ? 'Administrator' : profile.role === 'visitor' ? 'Visitor' : 'Member'}
                      </Badge>
                      {profile.ministryRole && (
                        <Badge variant="outline" className="px-3 py-1 border-church-primary text-church-primary">
                          {formatMinistryRole(profile.ministryRole)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-church-text-muted flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {profile.email}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-church-text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Member since {formatDate(profile.membershipDate || profile.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-church-accent" />
                        {profile.isActive ? 'Active Member' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} size="sm" className="gap-2 bg-church-primary hover:bg-church-primary/90" disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm" className="gap-2 border-church-primary text-church-primary" disabled={saving}>
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} size="sm" className="gap-2 bg-church-primary hover:bg-church-primary/90">
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
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-church-primary" />
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
                      <div className="flex items-center gap-3 p-3 bg-church-surface-hover rounded-lg border">
                        <User className="h-4 w-4 text-church-text-muted" />
                        <span className="font-medium">{formData.name || "Not provided"}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <div className="flex items-center gap-3 p-3 bg-church-surface-hover rounded-lg border">
                      <Mail className="h-4 w-4 text-church-text-muted" />
                      <span className="font-medium">{profile.email}</span>
                      <Badge variant="outline" className="ml-auto text-xs border-church-accent text-church-accent">Verified</Badge>
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
                      <div className="flex items-center gap-3 p-3 bg-church-surface-hover rounded-lg border">
                        <Phone className="h-4 w-4 text-church-text-muted" />
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
                      <div className="flex items-center gap-3 p-3 bg-church-surface-hover rounded-lg border">
                        <Calendar className="h-4 w-4 text-church-text-muted" />
                        <span className="font-medium">
                          {formData.birthday ? formatDate(formData.birthday) : "Not provided"}
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
                    <div className="flex items-start gap-3 p-3 bg-church-surface-hover rounded-lg border">
                      <MapPin className="h-4 w-4 text-church-text-muted mt-0.5" />
                      <span className="font-medium">{formData.address || "Not provided"}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-church-accent" />
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
                      {formData.interests ? (
                        formData.interests.split(",").map((interest, index) => (
                          <Badge key={index} variant="outline" className="bg-amber-50 text-church-primary border-church-accent/30">
                            {interest.trim()}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-church-text-muted text-sm">No interests added yet</span>
                      )}
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
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-lg border border-church-accent/20">
                      <p className="text-church-text leading-relaxed">
                        {formData.bio || "No bio added yet. Click 'Edit Profile' to add your bio."}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ministry Information */}
            {(profile.ministryRole || profile.ministryLevel || profile.ministryDescription) && (
              <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-church-primary" />
                    Ministry Information
                  </CardTitle>
                  <CardDescription>
                    Your ministry roles and responsibilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.ministryRole && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Ministry Role</Label>
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-church-primary/5 to-church-accent/10 rounded-lg border border-church-primary/20">
                        <Shield className="h-4 w-4 text-church-primary" />
                        <span className="font-medium text-church-primary">
                          {formatMinistryRole(profile.ministryRole)}
                        </span>
                      </div>
                    </div>
                  )}

                  {profile.ministryLevel && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Ministry Level</Label>
                      <div className="flex items-center gap-3 p-3 bg-church-surface-hover rounded-lg border">
                        <span className="font-medium">
                          {formatMinistryLevel(profile.ministryLevel)}
                        </span>
                      </div>
                    </div>
                  )}

                  {profile.ministryStartDate && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Ministry Start Date</Label>
                      <div className="flex items-center gap-3 p-3 bg-church-surface-hover rounded-lg border">
                        <Calendar className="h-4 w-4 text-church-text-muted" />
                        <span className="font-medium">
                          {formatDate(profile.ministryStartDate)}
                        </span>
                      </div>
                    </div>
                  )}

                  {profile.ministryDescription && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Ministry Description</Label>
                      <div className="p-4 bg-gradient-to-r from-church-primary/5 to-church-accent/10 rounded-lg border border-church-primary/20">
                        <p className="text-church-text leading-relaxed">
                          {profile.ministryDescription}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-3 hover:bg-church-primary/5 hover:border-church-primary hover:text-church-primary">
                  <Calendar className="h-4 w-4" />
                  View Events
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 hover:bg-church-accent/10 hover:border-church-accent hover:text-church-primary">
                  <Heart className="h-4 w-4" />
                  Prayer Requests
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 hover:bg-church-primary/5 hover:border-church-primary hover:text-church-primary">
                  <User className="h-4 w-4" />
                  Member Directory
                </Button>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-church-text-muted">Account Status</span>
                  <Badge variant="secondary" className="bg-church-accent/20 text-church-primary border-church-accent/30">
                    {profile.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-church-text-muted">Email Verified</span>
                  <CheckCircle className="h-4 w-4 text-church-accent" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-church-text-muted">Member Since</span>
                  <span className="text-sm font-medium">{formatDate(profile.membershipDate || profile.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
