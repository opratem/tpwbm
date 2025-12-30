"use client";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  Heart as Praying,
  Send,
  Shield,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

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
    "other",
  ]),
  priority: z.enum(["urgent", "high", "normal", "low"]),
  isAnonymous: z.boolean().default(false),
  isPublic: z.boolean().default(true),
  // For guest users
  guestName: z.string().optional(),
  guestEmail: z.string().optional(),
});

type FormData = z.infer<typeof prayerRequestSchema>;

const categoryOptions = [
  {
    value: "health",
    label: "Health & Healing",
    description: "Medical issues, surgeries, recovery",
  },
  {
    value: "family",
    label: "Family",
    description: "Family relationships, children, marriage",
  },
  {
    value: "work",
    label: "Work & Career",
    description: "Job searches, workplace issues, career decisions",
  },
  {
    value: "spiritual",
    label: "Spiritual Growth",
    description: "Faith journey, discipleship, calling",
  },
  {
    value: "financial",
    label: "Financial",
    description: "Provision, debt, financial struggles",
  },
  {
    value: "relationships",
    label: "Relationships",
    description: "Friendships, dating, community connections",
  },
  {
    value: "ministry",
    label: "Ministry",
    description: "Church service, ministry opportunities",
  },
  {
    value: "community",
    label: "Community",
    description: "Local community, outreach, social issues",
  },
  {
    value: "salvation",
    label: "Salvation",
    description: "Personal salvation, sharing faith with others",
  },
  {
    value: "thanksgiving",
    label: "Thanksgiving",
    description: "Praise reports, gratitude, blessings",
  },
  { value: "other", label: "Other", description: "Any other prayer need" },
];

const priorityOptions = [
  {
    value: "urgent",
    label: "Urgent",
    description: "Immediate prayer needed",
    color: "destructive",
  },
  {
    value: "high",
    label: "High",
    description: "Important prayer request",
    color: "orange",
  },
  {
    value: "normal",
    label: "Normal",
    description: "Regular prayer request",
    color: "default",
  },
  {
    value: "low",
    label: "Low",
    description: "General prayer request",
    color: "secondary",
  },
];

export default function PrayerPage() {
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm({
    resolver: zodResolver(prayerRequestSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "other" as const,
      priority: "normal" as const,
      isAnonymous: false,
      isPublic: true,
      guestName: "",
      guestEmail: "",
    },
  });

  const isAnonymous = form.watch("isAnonymous");
  const isLoggedIn = status === "authenticated";

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      // Prepare request data
      const requestData = {
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority,
        isAnonymous: data.isAnonymous,
        isPublic: data.isPublic,
        ...((!isLoggedIn || data.isAnonymous) && {
          guestName: data.guestName,
          guestEmail: data.guestEmail,
        }),
      };

      const response = await fetch("/api/prayer-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit prayer request");
      }

      const result = await response.json();

      toast.success("Prayer Request Submitted", {
        description:
          result.message ||
          "Your prayer request has been submitted successfully.",
      });

      setIsSubmitted(true);
      form.reset();
    } catch (error) {
      console.error("Error submitting prayer request:", error);
      toast.error("Submission Failed", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">
                Prayer Request Submitted
              </CardTitle>
              <CardDescription className="text-lg">
                Thank you for sharing your prayer request with our church
                family.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <Praying className="w-5 h-5" />
                  <span className="font-semibold">What happens next?</span>
                </div>
                <ul className="text-sm text-blue-600 space-y-1 text-left">
                  <li>
                    • Your prayer request is now active and visible to our
                    prayer team
                  </li>
                  <li>
                    • Our church family will be praying for your situation
                  </li>
                  <li>• You can submit additional prayer requests anytime</li>
                  <li>• Updates and answered prayers can be shared with us</li>
                </ul>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => setIsSubmitted(false)} variant="outline">
                  Submit Another Request
                </Button>
                {!isLoggedIn && (
                  <Button asChild>
                    <a href="/members/login">Join Our Community</a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 md:py-12">
      <Breadcrumbs />

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Submit a Prayer Request
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Share your prayer needs with our church family. All prayer requests
            are welcomed and will be prayed for by our community.
          </p>
        </div>

        {/* User Status Info */}
        <div className="mb-6">
          {isLoggedIn ? (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">
                      Logged in as {session?.user?.name}
                    </p>
                    <p className="text-sm text-blue-700">
                      Your prayer requests will be associated with your member
                      account
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-amber-600" />
                  <div>
                    <p className="font-semibold text-amber-900">
                      Guest Submission
                    </p>
                    <p className="text-sm text-amber-700">
                      You can submit prayer requests as a guest.{" "}
                      <a
                        href="/members/login"
                        className="underline hover:no-underline"
                      >
                        Login
                      </a>{" "}
                      to track your requests.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Prayer Request Form
            </CardTitle>
            <CardDescription>
              Share your prayer need with our caring church community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Guest Information (for non-logged in users or anonymous requests) */}
                {(!isLoggedIn || isAnonymous) && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900">
                      Contact Information
                    </h3>

                    <FormField
                      control={form.control}
                      name="guestName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Your Name{" "}
                            {!isAnonymous && (
                              <span className="text-red-500">*</span>
                            )}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={
                                isAnonymous
                                  ? "Leave blank for anonymous"
                                  : "Enter your name"
                              }
                              disabled={isAnonymous}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="guestEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder={
                                isAnonymous
                                  ? "Leave blank for anonymous"
                                  : "Enter your email for updates"
                              }
                              disabled={isAnonymous}
                            />
                          </FormControl>
                          <FormDescription>
                            We'll only use this to send you updates about your
                            prayer request
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Privacy Settings */}
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900">
                    Privacy Settings
                  </h3>

                  <FormField
                    control={form.control}
                    name="isAnonymous"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Anonymous Request
                          </FormLabel>
                          <FormDescription>
                            Your name won't be shown with this prayer request
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

                  <FormField
                    control={form.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Public Request
                          </FormLabel>
                          <FormDescription>
                            Allow other church members to see and pray for this
                            request
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

                {/* Prayer Request Details */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Prayer Request Title{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Brief title for your prayer request"
                        />
                      </FormControl>
                      <FormDescription>
                        A short, descriptive title (5-100 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Prayer Request Description{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Please share the details of your prayer request..."
                          className="min-h-[120px]"
                        />
                      </FormControl>
                      <FormDescription>
                        Share the details of your prayer need (10-1000
                        characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Category <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoryOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                <div>
                                  <div className="font-medium">
                                    {option.label}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {option.description}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {priorityOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={option.color as any}
                                    className="text-xs"
                                  >
                                    {option.label}
                                  </Badge>
                                  <span className="text-sm">
                                    {option.description}
                                  </span>
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

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Submitting Prayer Request...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Prayer Request
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Information Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              <ul className="space-y-2">
                <li>• All prayer requests are handled with confidentiality</li>
                <li>• You can choose to submit anonymously</li>
                <li>• Only church leadership and prayer team have access</li>
                <li>• Your contact information is never shared</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Prayer Support
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              <ul className="space-y-2">
                <li>• Our prayer team prays regularly for all requests</li>
                <li>• Urgent requests receive immediate attention</li>
                <li>• We celebrate answered prayers together</li>
                <li>• Follow-up support is available when needed</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
