import { Blog } from "@/components/ui/blog";
import { BookOpen } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="w-full mobile-section-spacing relative overflow-hidden min-h-[40vh] sm:min-h-[45vh] md:min-h-[50vh]">
        {/* Blurred background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://everyneighborhood.org/wp-content/uploads/2023/09/akira-hojo-_86u_Y0oAaM-unsplash-2-scaled.jpg)`,
            backgroundPosition: "50% 30%",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            filter: "blur(6px) brightness(0.6) contrast(1.3)",
          }}
        />

        {/* Enhanced overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-primary/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/40 to-primary/60" />

        <div className="container mobile-container mx-auto text-center relative z-10 h-full flex items-center justify-center">
          <div className="flex flex-col items-center justify-center mobile-space-y-6 text-white w-full">
            {/* Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto animate-in fade-in slide-in-from-top duration-1000 delay-200 drop-shadow-lg">
              <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>

            <div className="mobile-space-y-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-1000 px-4 sm:px-0">
              <h1 className="mobile-text-3xl font-extrabold bg-gradient-to-r from-white via-white/80 to-white bg-clip-text text-transparent drop-shadow-2xl">
                Spiritual Articles & Blog
              </h1>
              <p className="mobile-text-base text-white max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg">
                Discover inspiring articles, biblical insights, and practical wisdom for your spiritual journey.
                Read teachings from our pastors and ministry leaders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Component */}
      <Blog />
    </div>
  );
}
