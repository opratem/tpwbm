import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Heart, Users, Crown, Shield, BookOpen, Music, Megaphone } from "lucide-react";

export default function MinistriesPage() {
  const ministries = [
    {
      name: "Children Ministry",
      description: "Nurturing young hearts to know and love Jesus",
      href: "/ministries/children",
      icon: Heart,
      color: "from-pink-500 to-rose-600"
    },
    {
      name: "Youth Ministry",
      description: "Empowering the next generation for Christ",
      href: "/ministries/youth",
      icon: Users,
      color: "from-blue-500 to-indigo-600"
    },
    {
      name: "Women Ministry",
      description: "Building godly women of influence and purpose",
      href: "/ministries/women",
      icon: Crown,
      color: "from-purple-500 to-pink-600"
    },
    {
      name: "Men Ministry",
      description: "Raising men of valor and spiritual leadership",
      href: "/ministries/men",
      icon: Shield,
      color: "from-emerald-500 to-teal-600"
    },
    {
      name: "Music Ministry",
      description: "Worshiping God through music and song",
      href: "/ministries/music",
      icon: Music,
      color: "from-amber-500 to-orange-600"
    },
    {
      name: "Ushers Ministry",
      description: "Serving with excellence and hospitality",
      href: "/ministries/ushers",
      icon: Megaphone,
      color: "from-cyan-500 to-blue-600"
    },
    {
      name: "House of Grace",
      description: "Ministry outreach and community service",
      href: "/ministries/house-of-grace",
      icon: Heart,
      color: "from-red-500 to-rose-600"
    },
    {
      name: "ICWLC",
      description: "International Christian Women's Leadership Conference",
      href: "/ministries/icwlc",
      icon: Crown,
      color: "from-violet-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      <PageHeader
        title="Our Ministries"
        description="Discover opportunities to serve, grow, and make a difference in our church family"
        backgroundImage="/images/background/ministries_background.jpg"
        minHeight="sm"
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministries.map((ministry, index) => (
              <Link key={index} href={ministry.href}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer border-2 hover:border-primary/50">
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${ministry.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <ministry.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {ministry.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {ministry.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Get Involved</h2>
            <p className="text-gray-600 leading-relaxed">
              Every ministry plays a vital role in fulfilling our mission to serve God and our community.
              Whether you're passionate about worship, teaching, service, or outreach, there's a place for you
              to make an impact. Join us in making a difference!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
