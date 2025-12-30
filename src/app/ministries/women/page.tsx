import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getLeaderImagePath } from "@/lib/leader-images";
import { PageHeader } from "@/components/ui/page-header";
import {
  Flower,
  BookOpen,
  Users,
  Coffee,
  Heart,
  Clock,
  Calendar,
  MapPin,
  Crown,
  Sparkles,
  HandHeart
} from "lucide-react";

export default function WomenMinistryPage() {
  const womenLeaders = [
    { name: "Mrs. Ruth M. Oluwole", role: "Peculiar" },
    { name: "Mrs. Bola Komolafe", role: "Victory Sister" }
  ];

  const activities = [
    {
      title: "Women's Bible Study",
      description: "In-depth study of God's Word for women of all ages",
      time: "Tuesdays 10:00 AM - 11:30 AM",
      icon: BookOpen,
      color: "bg-purple-100 text-purple-800"
    },
    {
      title: "Prayer Circle",
      description: "Intercessory prayer for families, church, and community",
      time: "Thursdays 6:00 PM - 7:00 PM",
      icon: Heart,
      color: "bg-pink-100 text-pink-800"
    },
    {
      title: "Coffee & Fellowship",
      description: "Casual gatherings for encouragement and friendship",
      time: "Second Saturday of each month",
      icon: Coffee,
      color: "bg-rose-100 text-rose-800"
    },
    {
      title: "Craft Ministry",
      description: "Creative projects while building relationships",
      time: "Monthly",
      icon: Sparkles,
      color: "bg-violet-100 text-violet-800"
    }
  ];

  const programs = [
    {
      title: "Women's Retreat",
      description: "Annual retreat for spiritual refreshing and sisterhood",
      frequency: "Annual - Spring"
    },
    {
      title: "Mother's Day Celebration",
      description: "Honoring mothers and mother figures in our community",
      frequency: "Annual - May"
    },
    {
      title: "Marriage & Family Workshop",
      description: "Biblical guidance for wives and mothers",
      frequency: "Quarterly"
    },
    {
      title: "Community Outreach",
      description: "Serving women and families in our community",
      frequency: "Monthly"
    }
  ];

  const focusAreas = [
    {
      name: "Biblical Womanhood",
      description: "Understanding God's design for women in His kingdom",
      color: "bg-purple-100 text-purple-800"
    },
    {
      name: "Sisterhood",
      description: "Building meaningful relationships and support networks",
      color: "bg-pink-100 text-pink-800"
    },
    {
      name: "Spiritual Growth",
      description: "Deepening relationship with God through prayer and study",
      color: "bg-rose-100 text-rose-800"
    }
  ];

  const LeaderCard = ({ leader }: { leader: { name: string; role: string } }) => {
    const imagePath = getLeaderImagePath(leader.name);

    return (
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 border-4 border-purple-200">
            {imagePath ? (
                <Image
                    src={imagePath}
                    alt={leader.name}
                    fill
                    className="object-cover"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                  <Users className="h-12 w-12 text-purple-600" />
                </div>
            )}
          </div>
          <h3 className="font-semibold mobile-text-base text-gray-900">{leader.name}</h3>
          <p className="text-purple-600 font-medium">{leader.role}</p>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Hero Section */}
      <PageHeader
        title="Women's Ministry"
        subtitle="Empowered Women of Faith"
        description="Empowering women to walk in their God-given purpose through biblical teaching, encouraging fellowship, and authentic sisterhood that reflects Christ's love in every season of life."
        backgroundImage="/images/ministries/women-bg.jpg"
        minHeight="md"
      />

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 space-y-16">

          {/* About Section */}
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="mobile-text-2xl font-bold tracking-tight text-gray-900 mb-6">About Our Women's Ministry</h2>
            <p className="mobile-text-lg text-gray-600 mb-8 leading-relaxed">
              Our Women's Ministry is a vibrant community where women of all ages and seasons of life
              come together to grow in faith, build lasting friendships, and discover their unique
              calling in God's kingdom. We celebrate the beauty of womanhood as designed by our Creator.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mobile-text-lg mb-2">Daughters of the King</h3>
                <p className="text-gray-600">Embracing our identity as beloved daughters of God</p>
              </div>
              <div className="text-center">
                <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <HandHeart className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="font-semibold mobile-text-lg mb-2">Sisterhood</h3>
                <p className="text-gray-600">Supporting each other through life's joys and challenges</p>
              </div>
              <div className="text-center">
                <div className="bg-rose-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="font-semibold mobile-text-lg mb-2">Purpose</h3>
                <p className="text-gray-600">Living out our calling with grace and strength</p>
              </div>
            </div>
          </div>

          {/* Focus Areas */}
          <div>
            <div className="text-center mb-12">
              <h2 className="mobile-text-2xl font-bold tracking-tight text-gray-900 mb-4">Our Focus Areas</h2>
              <p className="text-gray-600">Areas of growth and development for women</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {focusAreas.map((area, index) => (
                  <Card key={index} className="border-2 border-purple-200 hover:shadow-lg transition-shadow">
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
              <h2 className="mobile-text-2xl font-bold text-gray-900 mb-4">Regular Activities</h2>
              <p className="text-gray-600">Growing together through study, prayer, and fellowship</p>
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
              <p className="text-gray-600">Annual events and special opportunities</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {programs.map((program, index) => (
                  <Card key={index} className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-purple-900 flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        {program.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-2">{program.description}</p>
                      <p className="text-sm text-purple-600 font-medium">{program.frequency}</p>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </div>

          {/* Leadership Team */}
          <div>
            <div className="text-center mb-12">
              <h2 className="mobile-text-2xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
              <p className="text-gray-600">Godly women leading with wisdom and love</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {womenLeaders.map((leader, index) => (
                  <LeaderCard key={index} leader={leader} />
              ))}
            </div>
          </div>

          {/* Contact & Information */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="mobile-text-2xl font-bold text-gray-900 mb-4">Join Our Sisterhood</h2>
              <p className="text-gray-600">Be part of a community where every woman is valued and loved</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mobile-text-lg mb-2">Location</h3>
                <p className="text-gray-600">Women's Fellowship Hall<br />TPWBM Church</p>
              </div>
              <div>
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mobile-text-lg mb-2">Meeting Times</h3>
                <p className="text-gray-600">Tuesdays<br />10:00 AM - 11:30 AM</p>
              </div>
              <div>
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Flower className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mobile-text-lg mb-2">All Women</h3>
                <p className="text-gray-600">Every Age<br />Every Season</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-700 mb-4">
                Whether you're a new believer, seasoned saint, young mother, or empty nester,
                you'll find a place of belonging in our women's ministry family.
              </p>
              <p className="text-sm text-gray-600">
                "She is clothed with strength and dignity; she can laugh at the days to come." - Proverbs 31:25
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
