import { FAQ } from "@/components/ui/faq";
import Image from "next/image";
import { HelpCircle, MessageCircle, Search, Users } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Modern Hero Section with Background */}
      <section className="relative text-white py-4 md:py-6 overflow-hidden">
        {/* Background Image with Blur */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/background/faq_background.jpg"
            alt="FAQ Help Support Background"
            fill
            className="object-cover opacity-60 blur-sm"
            priority
          />
          {/* Enhanced overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-primary/70 z-1" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/40 to-primary/60 z-1" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-4">
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 animate-in fade-in slide-in-from-top duration-1000 delay-200 drop-shadow-lg">
              <HelpCircle className="h-10 w-10 text-white" />
            </div>

            {/* Main Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-white via-white/80 to-white bg-clip-text text-transparent drop-shadow-2xl animate-in fade-in slide-in-from-top duration-1000 delay-400">
              Frequently Asked Questions
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-white max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg animate-in fade-in slide-in-from-top duration-1000 delay-600">
              Find answers to the most common questions about our church family, services, and community. We're here to help you on your spiritual journey.
            </p>

            {/* Feature Icons */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mt-8 animate-in fade-in slide-in-from-top duration-1000 delay-800">
              <div className="flex items-center text-white drop-shadow-md">
                <Search className="h-5 w-5 mr-3 text-white/80" />
                <span className="font-medium">Quick Answers</span>
              </div>
              <div className="flex items-center text-white drop-shadow-md">
                <MessageCircle className="h-5 w-5 mr-3 text-white/80" />
                <span className="font-medium">24/7 Support</span>
              </div>
              <div className="flex items-center text-white drop-shadow-md">
                <Users className="h-5 w-5 mr-3 text-white/80" />
                <span className="font-medium">Community Help</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Component */}
      <FAQ />
    </div>
  );
}
