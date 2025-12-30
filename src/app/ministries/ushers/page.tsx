import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getLeaderImagePath } from "@/lib/leader-images";
import { PageHeader } from "@/components/ui/page-header";
import {
  Users,
  BookOpen,
  HandHeart,
  Clock,
  Calendar,
  MapPin,
  DoorOpen,
  Shield,
  Heart,
  Handshake,
  UserCheck,
  Award
} from "lucide-react";

export default function UshersMinistryPage() {
  const ushersLeaders = [
    { name: "Mrs. Yemisi Ajayi", role: "Head Usher" }
  ];

  const responsibilities = [
    {
      title: "Welcome Ministry",
      description: "Greeting and welcoming visitors and members with warmth",
      icon: DoorOpen,
      color: "bg-green-100 text-green-800"
    },
    {
      title: "Seating Assistance",
      description: "Helping members and visitors find appropriate seating",
      icon: UserCheck,
      color: "bg-emerald-100 text-emerald-800"
    },
    {
      title: "Security & Safety",
      description: "Maintaining order and ensuring safety during services",
      icon: Shield,
      color: "bg-teal-100 text-teal-800"
    },
    {
      title: "Offering Collection",
      description: "Reverent collection and handling of tithes and offerings",
      icon: HandHeart,
      color: "bg-lime-100 text-lime-800"
    }
  ];

  const programs = [
    {
      title: "Ushers Training",
      description: "Regular training sessions on hospitality and service excellence",
      frequency: "Monthly"
    },
    {
      title: "Special Events Support",
      description: "Coordinating services for weddings, funerals, and special programs",
      frequency: "As Needed"
    },
    {
      title: "Emergency Response Training",
      description: "Training for handling medical and safety emergencies",
      frequency: "Quarterly"
    },
    {
      title: "Appreciation Service",
      description: "Annual recognition of faithful ushers' service",
      frequency: "Annual"
    }
  ];

  const qualifications = [
    {
      name: "Heart for Service",
      description: "Genuine desire to serve God and His people with excellence",
      color: "bg-green-100 text-green-800"
    },
    {
      name: "Faithful Attendance",
      description: "Regular attendance and commitment to church services",
      color: "bg-emerald-100 text-emerald-800"
    },
    {
      name: "Good Character",
      description: "Demonstrating Christian character and integrity",
      color: "bg-teal-100 text-teal-800"
    }
  ];

  const LeaderCard = ({ leader }: { leader: { name: string; role: string } }) => {
    const imagePath = getLeaderImagePath(leader.name);

    return (
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 border-4 border-green-200">
          {imagePath ? (
            <Image
              src={imagePath}
              alt={leader.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
              <Users className="h-12 w-12 text-green-600" />
            </div>
          )}
        </div>
        <h3 className="font-semibold text-lg text-gray-900">{leader.name}</h3>
        <p className="text-green-600 font-medium">{leader.role}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Hero Section */}
      <PageHeader
        title="Ushers Ministry"
        subtitle="First Impressions Ministry"
        description="Serving as the welcoming face of our church, creating an atmosphere of warmth, order, and reverence that allows everyone to encounter God's presence through excellent hospitality and faithful service."
        backgroundImage="/images/ministries/ushers-bg.jpg"
        minHeight="md"
      />

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 space-y-16">

          {/* About Section */}
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="mobile-text-2xl font-bold tracking-tight text-gray-900 mb-6">About Our Ushers Ministry</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our Ushers Ministry is the first ministry many people encounter when they visit our church.
              We are committed to creating a welcoming environment where every person feels valued,
              loved, and ready to worship God. Our ushers serve with excellence, integrity, and joy.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Welcoming Spirit</h3>
                <p className="text-gray-600">Creating a warm, inviting atmosphere for all</p>
              </div>
              <div className="text-center">
                <div className="bg-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Handshake className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Faithful Service</h3>
                <p className="text-gray-600">Consistent, reliable ministry with excellence</p>
              </div>
              <div className="text-center">
                <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Excellence</h3>
                <p className="text-gray-600">Maintaining high standards in all we do</p>
              </div>
            </div>
          </div>

          {/* Qualifications */}
          <div>
            <div className="text-center mb-12">
              <h2 className="mobile-text-2xl font-bold tracking-tight text-gray-900 mb-4">Usher Qualifications</h2>
              <p className="text-gray-600">What we look for in our ushers ministry team</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {qualifications.map((qualification, index) => (
                <Card key={index} className="border-2 border-green-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-center">
                      <Badge className={`text-lg px-4 py-2 ${qualification.color}`}>
                        {qualification.name}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-center">{qualification.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Responsibilities */}
          <div>
            <div className="text-center mb-12">
              <h2 className="mobile-text-2xl font-bold text-gray-900 mb-4">Our Responsibilities</h2>
              <p className="text-gray-600">Key areas of service in our ushers ministry</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {responsibilities.map((responsibility, index) => (
                <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <responsibility.icon className="h-6 w-6 mr-2" />
                      {responsibility.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-3">{responsibility.description}</p>
                    <Badge className={`${responsibility.color}`}>
                      Essential Service
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Training & Programs */}
          <div>
            <div className="text-center mb-12">
              <h2 className="mobile-text-2xl font-bold text-gray-900 mb-4">Training & Programs</h2>
              <p className="text-gray-600">Ongoing development and special initiatives</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {programs.map((program, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-900 flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      {program.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-2">{program.description}</p>
                    <p className="text-sm text-green-600 font-medium">{program.frequency}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Leadership Team */}
          <div>
            <div className="text-center mb-12">
              <h2 className="mobile-text-2xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
              <p className="text-gray-600">Experienced servants leading our ushers ministry</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {ushersLeaders.map((leader, index) => (
                <LeaderCard key={index} leader={leader} />
              ))}
            </div>
          </div>

          {/* Join Us Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="mobile-text-2xl font-bold text-gray-900 mb-4">Join Our Ushers Team</h2>
              <p className="text-gray-600">Be part of a ministry that serves as the front door of our church</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Service Areas</h3>
                <p className="text-gray-600">Sanctuary, Foyer<br />& Church Grounds</p>
              </div>
              <div>
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Service Times</h3>
                <p className="text-gray-600">All Services<br />& Special Events</p>
              </div>
              <div>
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <DoorOpen className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Requirements</h3>
                <p className="text-gray-600">Heart for Service<br />& Commitment</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-700 mb-4">
                If you have a heart for serving others and want to be part of creating
                a welcoming environment for worship, we'd love to have you join our team.
              </p>
              <p className="text-sm text-gray-600">
                "Serve one another humbly in love." - Galatians 5:13
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
