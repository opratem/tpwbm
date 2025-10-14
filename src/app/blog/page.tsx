import { Blog } from "@/components/ui/blog";
import { BookOpen } from "lucide-react";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="w-full py-4 md:py-6 lg:py-8 relative overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex flex-col items-center justify-center space-y-3 text-white">
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-in fade-in slide-in-from-top duration-1000 delay-200 drop-shadow-lg">
              <BookOpen className="h-10 w-10 text-white" />
            </div>

            <div className="space-y-3 animate-in fade-in-50 slide-in-from-bottom-4 duration-1000">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-white drop-shadow-lg shadow-black">Spiritual Articles &</span>{" "}
                <span className="bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
                  Blog
                </span>
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto font-light leading-relaxed">
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
