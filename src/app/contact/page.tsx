"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export default function ContactPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      console.log(values);
      toast.success("Your message has been sent! We'll be in touch soon.");
      form.reset();
      setIsSubmitting(false);
    }, 1000);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <PageHeader
        title="Get in Touch"
        description="We'd love to hear from you. Get in touch with us today."
        backgroundImage="https://images.squarespace-cdn.com/content/v1/66e074a8a254c742976157fc/6f0e011f-4573-4ab4-8c4c-25c0c9fb0d9c/ContactUs-2024.jpg"
        minHeight="sm"
        overlay="medium"
        blurBackground={true}
      />

      {/* Main Content */}
      <section className="w-full mobile-section-spacing">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information Section */}
            <div className="space-y-8">
              <div className="text-center lg:text-left mb-12 animate-in fade-in slide-in-from-left duration-1000">
                <h2 className="mobile-text-2xl font-bold tracking-tight mb-4">
                  Get In{" "}
                  <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                    Touch
                  </span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary mx-auto lg:mx-0 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400 mobile-text-lg">
                  We're here to help and answer any questions you might have.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-6">
                {/* Address Card */}
                <Card className="border-l-4 border-l-church-primary shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 mobile-text-lg">
                      <MapPin className="h-6 w-6 text-church-primary dark:text-church-accent" />
                      Our Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Behind Asero Carwash,<br />
                      Opposite MRS Filling Station,<br />
                      Asero, Abeokuta.
                    </p>
                  </CardContent>
                </Card>

                {/* Contact Numbers Card */}
                <Card className="border-l-4 border-l-church-accent shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 mobile-text-lg">
                      <Phone className="h-6 w-6 text-church-accent" />
                      Phone Numbers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-gray-700 dark:text-gray-300">+234 813 267 5172</p>
                    <p className="text-gray-700 dark:text-gray-300">+234 706 447 5723</p>
                  </CardContent>
                </Card>

                {/* Email Card */}
                <Card className="border-l-4 border-l-church-primary-light shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 mobile-text-lg">
                      <Mail className="h-6 w-6 text-church-primary-light" />
                      Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">prevailingword95@gmail.com</p>
                  </CardContent>
                </Card>

                {/* Office Hours Card */}
                <Card className="border-l-4 border-l-church-accent shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-3 mobile-text-lg">
                      <Clock className="h-6 w-6 text-church-accent" />
                      Office Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-gray-700 dark:text-gray-300">Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p className="text-gray-700 dark:text-gray-300">Sunday: 8:00 AM - 1:00 PM</p>
                  </CardContent>
                </Card>
              </div>

              {/* Service Times Section */}
              <Card className="bg-gradient-to-br from-church-accent/10 to-church-accent/20 dark:from-church-accent/5 dark:to-church-accent/10 border-2 border-church-accent/30 dark:border-church-accent/20">
                <CardHeader>
                  <CardTitle className="mobile-text-2xl text-center">
                    Service{" "}
                    <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                      Times
                    </span>
                  </CardTitle>
                  <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary mx-auto mt-2"></div>
                  <CardDescription className="text-center">
                    Join us for worship and fellowship
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                      <p className="font-semibold text-church-primary dark:text-church-accent">Sunday Bible School</p>
                      <p className="mobile-text-sm text-gray-600 dark:text-gray-400">Sunday [8:30am]</p>
                    </div>
                    <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                      <p className="font-semibold text-church-primary dark:text-church-accent">Celebration of Jesus</p>
                      <p className="mobile-text-sm text-gray-600 dark:text-gray-400">Sunday [9:30am]</p>
                    </div>
                    <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                      <p className="font-semibold text-church-primary dark:text-church-accent">Hour of the Word</p>
                      <p className="mobile-text-sm text-gray-600 dark:text-gray-400">Tuesday [5:00pm]</p>
                    </div>
                    <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                      <p className="font-semibold text-church-primary dark:text-church-accent">Rain of Mercy Prophetic Prayers</p>
                      <p className="mobile-text-sm text-gray-600 dark:text-gray-400">1st Saturday [6:30am]</p>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg mt-4">
                    <p className="font-semibold text-church-primary dark:text-church-accent">Overcomers' Vigil</p>
                    <p className="mobile-text-sm text-gray-600 dark:text-gray-400">Last Friday [12:00noon]</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="animate-in fade-in slide-in-from-right duration-1000 delay-200">
              <Card className="shadow-xl border-2 border-gray-100 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="mobile-text-2xl">
                    Send Us a{" "}
                    <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                      Message
                    </span>
                  </CardTitle>
                  <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary mb-2"></div>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Your email address" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Your phone number" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="Message subject" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Your message"
                                className="min-h-[140px] resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full h-12 mobile-text-lg font-semibold" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4 mr-2" />
                        )}
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="w-full py-16 md:py-24 bg-gradient-to-br from-gray-50 to-church-accent/10 dark:from-gray-900 dark:to-church-accent/5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12 animate-in fade-in slide-in-from-top duration-1000">
            <h2 className="mobile-text-2xl font-bold tracking-tight">
              Find{" "}
              <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                Us
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary mx-auto"></div>
            <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-400 md:text-xl">
              We're located in the heart of Abeokuta. Come visit us!
            </p>
          </div>

          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
            <Card className="overflow-hidden shadow-2xl border-2 border-gray-200 dark:border-gray-800">
              <CardContent className="p-0">
                <div className="relative h-[500px] w-full">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.1234567890123!2d3.3746398!3d7.1751678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103a4908ea6a645f%3A0x4b9b1759ffee4722!2sThe%20Prevailing%20Word%20Believers%20Ministry%20Inc!5e0!3m2!1sen!2sng!4v1693123456789!5m2!1sen!2sng"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="The Prevailing Word Believers Ministry Inc Location"
                    className="rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Directions */}
            <div className="mt-8 text-center">
              <Card className="inline-block">
                <CardContent className="p-6">
                  <h3 className="mobile-text-lg font-semibold mb-2">Need Directions?</h3>
                  <p className="mobile-text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Click the map above or use the button below to get directions
                  </p>
                  <Button asChild variant="outline">
                    <a
                      href="https://www.google.com/maps/place/The+Prevailing+Word+Believers+Ministry+Inc/@7.1751678,3.3746398,17z/data=!3m1!4b1!4m6!3m5!1s0x103a4908ea6a645f:0x4b9b1759ffee4722!8m2!3d7.1751678!4d3.3746398!16s%2Fg%2F11hlr39psj?entry=ttu&g_ep=EgoyMDI1MDgxOC4wIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      Open in Google Maps
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
