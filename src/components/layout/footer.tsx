import Link from "next/link";
import Image from "next/image";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { Facebook, Instagram, Youtube, Twitter, Mail, MapPin, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewsletterSignup } from "@/components/ui/newsletter-signup";
import { getCloudinaryImageUrl } from "@/lib/cloudinary-client";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full border-t bg-background"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="container py-8 sm:py-10 md:py-12 lg:py-16 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <NewsletterSignup />
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container py-8 sm:py-10 md:py-12 lg:py-16 px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {/* Church Info - Mobile Optimized */}
          <div className="space-y-4 sm:space-y-5 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src="/images/CHURCH%20LOGO.png"
                  alt="The Prevailing Word Believers Ministry Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                  fallbackSrc={getCloudinaryImageUrl("tpwbm/CHURCH_LOGO", { width: 48, height: 48, crop: 'fit' })}
                />
              </div>
              <span className="text-base sm:text-lg md:text-xl font-bold text-primary leading-tight">
                The Prevailing Word Believers Ministry Inc.
              </span>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              A place of worship where value is added to life. Join us as we seek to love God and serve our community together.
            </p>

            {/* Social Media Links - Mobile Optimized */}
            <div className="flex space-x-3 sm:space-x-4 pt-2" role="navigation" aria-label="Social media links">
              <Link
                href="https://facebook.com/theprevailingwordbelieversmin"
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Visit our Facebook page"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={20} aria-hidden="true" />
              </Link>
              <Link
                href="https://instagram.com"
                className="text-muted-foreground hover:text-accent transition-colors p-2 hover:bg-accent/10 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Visit our Instagram page"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} aria-hidden="true" />
              </Link>
              <Link
                href="https://youtube.com"
                className="text-muted-foreground hover:text-accent transition-colors p-2 hover:bg-accent/10 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Visit our YouTube channel"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube size={20} aria-hidden="true" />
              </Link>
              <Link
                href="https://twitter.com"
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Visit our Twitter page"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={20} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Quick Links - Mobile Optimized */}
          <nav className="space-y-4 sm:space-y-5" aria-label="Footer quick links">
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-foreground">Quick Links</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li>
                <Link
                  href="/about"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors block py-1 hover:underline"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors block py-1 hover:underline"
                >
                  Worship Services
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors block py-1 hover:underline"
                >
                  Events Calendar
                </Link>
              </li>
              <li>
                <Link
                  href="/sermons"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors block py-1 hover:underline"
                >
                  Sermons & Messages
                </Link>
              </li>
              <li>
                <Link
                  href="/giving"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors block py-1 hover:underline"
                >
                  Giving & Donations
                </Link>
              </li>
              <li>
                <Link
                  href="/members"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors block py-1 hover:underline"
                >
                  Member Login
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact Information - Mobile Optimized */}
          <div className="space-y-4 sm:space-y-5" role="region" aria-label="Contact information">
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-foreground">Contact Us</h3>
            <ul className="space-y-4 sm:space-y-5">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <address className="text-sm sm:text-base text-muted-foreground leading-relaxed not-italic">
                  Behind Asero Carwash<br />
                  Opposite MRS Filling Station,<br />
                  Asero, Abeokuta
                </address>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  <a
                    href="tel:+2348132675172"
                    className="block hover:text-primary transition-colors py-1"
                    aria-label="Call us at +234 813 267 5172"
                  >
                    +234 813 267 5172
                  </a>
                  <a
                    href="tel:+2347064475723"
                    className="block hover:text-primary transition-colors py-1"
                    aria-label="Call us at +234 706 447 5723"
                  >
                    +234 706 447 5723
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <a
                  href="mailto:prevailingword95@gmail.com"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors py-1"
                  aria-label="Email us at prevailingword95@gmail.com"
                >
                  prevailingword95@gmail.com
                </a>
              </li>
            </ul>

            <Button
              variant="outline"
              size="sm"
              className="mt-4 sm:mt-6 w-full sm:w-auto min-h-[44px] rounded-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              asChild
              aria-label="Go to contact page"
            >
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>

          {/* Service Times - Mobile Optimized */}
          <div className="space-y-4 sm:space-y-5" role="region" aria-label="Service times">
            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-foreground">Service Times</h3>
            <ul className="space-y-4 sm:space-y-5">
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <span className="block text-sm sm:text-base font-medium text-foreground mb-1">Sunday Services</span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    <time dateTime="08:30">8:30 AM</time> - Sunday School<br />
                    <time dateTime="09:30">9:30 AM</time> - Celebration of Jesus
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <span className="block text-sm sm:text-base font-medium text-foreground mb-1">Tuesday Bible Study</span>
                  <span className="text-sm text-muted-foreground">
                    <time dateTime="17:00">5:00 PM</time> - <time dateTime="19:30">7:30 PM</time>
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <span className="block text-sm sm:text-base font-medium text-foreground mb-1">Office Hours</span>
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    Monday - Friday<br />
                    <time dateTime="09:00">9:00 AM</time> - <time dateTime="17:00">5:00 PM</time>
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer - Copyright - Mobile Optimized */}
      <div className="border-t border-border">
        <div className="container py-4 sm:py-6 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            &copy; {currentYear} The Prevailing Word Believers Ministry Inc. All rights reserved.
          </div>
          <nav
            className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-xs sm:text-sm"
            aria-label="Footer legal links"
          >
            <Link
              href="/privacy-policy"
              className="text-muted-foreground hover:text-primary transition-colors py-1 hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-muted-foreground hover:text-primary transition-colors py-1 hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              href="/sitemap"
              className="text-muted-foreground hover:text-primary transition-colors py-1 hover:underline"
            >
              Sitemap
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
