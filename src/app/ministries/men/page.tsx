import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getLeaderImagePath } from "@/lib/leader-images";
import { PageHeader } from "@/components/ui/page-header";
import {
  Shield,
  BookOpen,
  Users,
  Star,
  Hammer,
  Coffee,
  Clock,
  Calendar,
  MapPin,
  Crown,
  Handshake,
  Trophy
} from "lucide-react";

export default function MenMinistryPage() {
  const menLeaders = [
    { name: "Dn. Lawrence S. Komolafe", role: "Men's Ministry Leader" }
  ];

  const activities = [
    {
      title: "Men's Bible Study",
      description: "Deep study of God's Word focusing on biblical manhood",
      time: "Saturdays 7:00 AM - 8:30 AM",
      icon: BookOpen,
      color: "bg-blue-100 text-blue-800"
    },
    {
      title: "Prayer Warriors",
      description: "Intercession and spiritual warfare for our families and church",
      time: "Fridays 6:00 AM - 7:00 AM",
      icon: Shield,
      color: "bg-navy-100 text-navy-800"
    },
    {
      title: "Brotherhood Fellowship",
      description: "Building strong relationships and accountability partnerships",
      time: "Third Saturday of each month",
      icon: Coffee,
      color: "bg-slate-100 text-slate-800"
    },
    {
      title: "Service Projects",
      description: "Hands-on ministry serving the church and community",
      time: "Monthly",
      icon: Hammer,
      color: "bg-indigo-100 text-indigo-800"
    }
  ];

  const programs = [
    {
      title: "Men's Retreat",
      description: "Annual retreat focused on spiritual growth and brotherhood",
      frequency: "Annual - Fall"
    },
    {
      title: "Father's Day Celebration",
      description: "Honoring fathers and father figures in our community",
      frequency: "Annual - June"
    },
    {
      title: "Marriage Enrichment",
      description: "Workshops and seminars strengthening marriages",
      frequency: "Quarterly"
    },
    {
      title: "Mentorship Program",
      description: "Pairing experienced men with younger believers",
      frequency: "Ongoing"
    }
  ];

  const focusAreas = [
    {
      name: "Spiritual Leadership",
      description: "Leading families and communities in godly wisdom",
      color: "bg-blue-100 text-blue-800"
    },
    {
      name: "Biblical Manhood",
      description: "Understanding God's design for masculine identity",
      color: "bg-indigo-100 text-indigo-800"
    },
    {
      name: "Brotherhood",
      description: "Building lasting friendships and accountability",
      color: "bg-slate-100 text-slate-800"
    }
  ];

  const LeaderCard = ({ leader }: { leader: { name: string; role: string } }) => {
    const imagePath = getLeaderImagePath(leader.name);

    return (
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 border-4 border-blue-200">
            {imagePath ? (
                <Image
                    src={imagePath}
                    alt={leader.name}
                    fill
                    className="object-cover"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <Users className="h-12 w-12 text-blue-600" />
                </div>
            )}
          </div>
          <h3 className="font-semibold mobile-text-lg text-gray-900">{leader.name}</h3>
          <p className="text-blue-600 font-medium">{leader.role}</p>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Hero Section */}
      <PageHeader
        title="Men's Ministry"
        subtitle="Building Godly Men"
        description="Equipping men to be godly leaders, faithful husbands, loving fathers, and servants of Christ who make a lasting impact in their families, church, and communities."
        backgroundImage="/images/ministries/men-bg.jpg"
        minHeight="md"
      />

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 space-y-16">

          {/* About Section */}
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="mobile-text-2xl font-bold tracking-tight text-gray-900 mb-6">About Our Men's Ministry</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our Men's Ministry is dedicated to building strong, godly men who lead with integrity,
              serve with humility, and live with purpose. We create a brotherhood where men can grow
              spiritually, support one another, and be equipped for effective ministry.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mobile-text-lg mb-2">Spiritual Leadership</h3>
                <p className="text-gray-600">Leading families and communities with godly wisdom</p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Handshake className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="font-semibold mobile-text-lg mb-2">Brotherhood</h3>
                <p className="text-gray-600">Building authentic relationships and accountability</p>
              </div>
              <div className="text-center">
                <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-slate-600" />
                </div>
                <h3 className="font-semibold mobile-text-lg mb-2">Excellence</h3>
                <p className="text-gray-600">Pursuing excellence in all areas of life</p>
              </div>
            </div>
          </div>

          {/* Focus Areas */}
          <div>
            <div className="text-center mb-12">
              <h2 className="mobile-text-2xl font-bold tracking-tight text-gray-900 mb-4">Our Focus Areas</h2>
              <p className="text-gray-600">Key areas of growth and development for men</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {focusAreas.map((area, index) => (
                  <Card key={index} className="border-2 border-blue-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-center">
                        <Badge className={`text-lg px-4 py-2 ${area.color}`}>
                          {area.name}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 text-center">{area.description}</p>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div>
            <div className="text-center mb-12">
              <h2 className="mobile-text-2xl font-bold tracking-tight text-gray-900 mb-4">Regular Activities</h2>
              <p className="text-gray-600">Building men of God through consistent fellowship and service</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {activities.map((activity, index) => (
                  <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <activity.icon className="h-6 w-6 mr-2" />
                        {activity.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-3">{activity.description}</p>
                      <Badge className={`${activity.color}`}>
                        {activity.time}
                      </Badge>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </div>

          {/* Special Programs */}
          <div>
            <div className="text-center mb-12">
              <h2 className="mobile-text-2xl font-bold text-gray-900 mb-4">Special Programs</h2>
              <p className="text-gray-600">Annual events and ongoing initiatives</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {programs.map((program, index) => (
                  <Card key={index} className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-900 flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        {program.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-2">{program.description}</p>
                      <p className="text-sm text-blue-600 font-medium">{program.frequency}</p>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </div>

          {/* Leadership Team */}
          <div>
            <div className="text-center mb-12">
              <h2 className="mobile-text-2xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
              <p className="text-gray-600">Men of integrity leading our ministry</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {menLeaders.map((leader, index) => (
                  <LeaderCard key={index} leader={leader} />
              ))}
            </div>
          </div>

          {/* Contact & Information */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="mobile-text-2xl font-bold text-gray-900 mb-4">Join the Brotherhood</h2>
              <p className="text-gray-600">Be part of a community of men committed to Christ and each other</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mobile-text-lg mb-2">Location</h3>
                <p className="text-gray-600">Fellowship Hall<br />TPWBM Church</p>
              </div>
              <div>
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mobile-text-lg mb-2">Meeting Times</h3>
                <p className="text-gray-600">Saturdays<br />7:00 AM - 8:30 AM</p>
              </div>
              <div>
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mobile-text-lg mb-2">All Men</h3>
                <p className="text-gray-600">Every Age<br />Every Background</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-700 mb-4">
                Join us as we grow together in faith, support one another through life's challenges,
                and serve our families, church, and community with excellence.
              </p>
              <p className="text-sm text-gray-600">
                "As iron sharpens iron, so one man sharpens another." - Proverbs 27:17
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
