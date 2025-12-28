import { FAQ } from "@/components/ui/faq";
import Image from "next/image";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { HelpCircle, MessageCircle, Search, Users } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Hero Section */}
      <PageHeader
        title="Frequently Asked Questions"
        description="Find answers to the most common questions about our church family, services, and community. We're here to help you on your spiritual journey."
        backgroundImage="/images/background/faq_background.jpg"
        minHeight="sm"
        overlay="medium"
        blurBackground={true}
      />

      {/* FAQ Component */}
      <FAQ />
    </div>
  );
}
