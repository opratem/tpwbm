"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import {
  Heart,
  Send,
  Plus,
  X,
  Calendar,
  Clock,
  User,
  Shield,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { PrayerRequestCategory, PrayerRequestPriority } from "@/types/prayer-requests";

// Form validation schema
const prayerRequestSchema = z.object({
  title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title must not exceed 100 characters")
      .trim(),
  description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description must not exceed 1000 characters")
      .trim(),
  category: z.enum([
    "health",
    "family",
    "work",
    "spiritual",
    "financial",
    "relationships",
    "ministry",
    "community",
    "salvation",
    "thanksgiving",
    "other"
  ]),
  priority: z.enum(["urgent", "high", "normal", "low"]),
  isAnonymous: z.boolean().default(false),
  isPublic: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  expiresAt: z.string().optional(),
});

type FormData = z.infer<typeof prayerRequestSchema>;

interface PrayerRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting?: boolean;
}

const categoryOptions: { value: PrayerRequestCategory; label: string; description: string }[] = [
  { value: "health", label: "Health & Healing", description: "Medical issues, surgeries, recovery" },
  { value: "family", label: "Family", description: "Family relationships, children, marriage" },
  { value: "work", label: "Work & Career", description: "Job searches, workplace issues, career decisions" },
  { value: "spiritual", label: "Spiritual Growth", description: "Faith journey, discipleship, calling" },
  { value: "financial", label: "Financial", description: "Provision, debt, financial struggles" },
  { value: "relationships", label: "Relationships", description: "Friendships, conflicts, reconciliation" },
  { value: "ministry", label: "Ministry", description: "Church service, missions, evangelism" },
  { value: "community", label: "Community", description: "Local issues, neighborhood, society" },
  { value: "salvation", label: "Salvation", description: "Praying for unsaved friends and family" },
  { value: "thanksgiving", label: "Thanksgiving", description: "Praise reports and gratitude" },
  { value: "other", label: "Other", description: "Other prayer needs" },
];

const priorityOptions: { value: PrayerRequestPriority; label: string; color: string; description: string }[] = [
  { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-800", description: "Immediate prayer needed" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-800", description: "Important prayer request" },
  { value: "normal", label: "Normal", color: "bg-blue-100 text-blue-800", description: "Regular prayer request" },
  { value: "low", label: "Low", color: "bg-gray-100 text-gray-800", description: "General prayer need" },
];

export function PrayerRequestForm({ isOpen, onClose, onSubmit, isSubmitting = false }: PrayerRequestFormProps) {
  const [newTag, setNewTag] = useState("");
  const [showExpiryDialog, setShowExpiryDialog] = useState(false);

  const form = useForm({
    resolver: zodResolver(prayerRequestSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "other",
      priority: "normal",
      isAnonymous: false,
      isPublic: true,
      tags: [],
      expiresAt: "",
    },
  });

  const selectedCategory = form.watch("category");
  const selectedPriority = form.watch("priority");
  const isAnonymous = form.watch("isAnonymous");
  const isPublic = form.watch("isPublic");
  const tags = form.watch("tags") || [];

  const handleSubmit = async (data: FormData) => {
    try {
      const formData: FormData = {
        ...data,
        tags: data.tags,
      };
      await onSubmit(formData);
      form.reset();
      onClose();
      toast.success("Prayer request submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit prayer request. Please try again.");
      console.error("Error submitting prayer request:", error);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      form.setValue("tags", updatedTags);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    form.setValue("tags", updatedTags);
  };

  const setExpiryDate = (days: number) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    form.setValue("expiresAt", expiryDate.toISOString());
    setShowExpiryDialog(false);
  };

  if (!isOpen) return null;

  return (
      <>
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Submit Prayer Request
                  </CardTitle>
                  <CardDescription>
                    Share your prayer needs with our church family
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  {/* Title Field */}
                  <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prayer Request Title *</FormLabel>
                            <FormControl>
                              <Input
                                  placeholder="Brief title for your prayer request..."
                                  {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              A clear, concise title (5-100 characters)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                      )}
                  />

                  {/* Description Field */}
                  <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel>Prayer Request Details *</FormLabel>
                            <FormControl>
                              <Textarea
                                  placeholder="Please share your prayer request in detail..."
                                  rows={4}
                                  {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Share your prayer needs in detail (10-1000 characters)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                      )}
                  />

                  {/* Category and Priority Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Category Field */}
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categoryOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        <div>
                                          <div className="font-medium">{option.label}</div>
                                          <div className="text-xs text-gray-500">{option.description}</div>
                                        </div>
                                      </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Priority Field */}
                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel>Priority *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {priorityOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        <div className="flex items-center gap-2">
                                          <Badge className={option.color}>{option.label}</Badge>
                                          <span className="text-xs text-gray-500">{option.description}</span>
                                        </div>
                                      </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                        )}
                    />
                  </div>

                  {/* Tags Field */}
                  <div className="space-y-2">
                    <Label>Tags (Optional)</Label>
                    <div className="flex gap-2">
                      <Input
                          placeholder="Add a tag..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTag();
                            }
                          }}
                      />
                      <Button type="button" variant="outline" onClick={addTag}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                {tag}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-4 w-4 p-0"
                                    onClick={() => removeTag(tag)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                          ))}
                        </div>
                    )}
                  </div>

                  {/* Privacy Settings */}
                  <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <h3 className="font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Privacy Settings
                    </h3>

                    {/* Anonymous Toggle */}
                    <FormField
                        control={form.control}
                        name="isAnonymous"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Submit Anonymously</FormLabel>
                                <FormDescription>
                                  Your name will not be shown with this request
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* Public Toggle */}
                    <FormField
                        control={form.control}
                        name="isPublic"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Public Request</FormLabel>
                                <FormDescription>
                                  Allow all church members to see and pray for this request
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                        )}
                    />
                  </div>

                  {/* Expiry Settings */}
                  <div className="space-y-2">
                    <Label>Auto-Archive (Optional)</Label>
                    <div className="flex gap-2">
                      <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowExpiryDialog(true)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Set Auto-Archive
                      </Button>
                      {form.watch("expiresAt") && (
                          <Badge variant="secondary">
                            Expires: {new Date(form.watch("expiresAt")!).toLocaleDateString()}
                          </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Optional: Set when this request should be automatically archived
                    </p>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                      ) : (
                          <Send className="h-4 w-4 mr-2" />
                      )}
                      {isSubmitting ? "Submitting..." : "Submit Prayer Request"}
                    </Button>
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Expiry Date Dialog */}
        <AlertDialog open={showExpiryDialog} onOpenChange={setShowExpiryDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Set Auto-Archive Date</AlertDialogTitle>
              <AlertDialogDescription>
                Choose when this prayer request should be automatically archived.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid grid-cols-2 gap-2 py-4">
              <Button variant="outline" onClick={() => setExpiryDate(7)}>
                1 Week
              </Button>
              <Button variant="outline" onClick={() => setExpiryDate(30)}>
                1 Month
              </Button>
              <Button variant="outline" onClick={() => setExpiryDate(90)}>
                3 Months
              </Button>
              <Button variant="outline" onClick={() => setExpiryDate(180)}>
                6 Months
              </Button>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                form.setValue("expiresAt", "");
                setShowExpiryDialog(false);
              }}>
                No Expiry
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
  );
}
