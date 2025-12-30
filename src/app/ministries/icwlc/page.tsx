import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getLeaderImagePath } from "@/lib/leader-images";
import { PageHeader } from "@/components/ui/page-header";
import {
  Users,
  BookOpen,
  Award,
  Clock,
  Calendar,
  MapPin,
  Globe,
  Handshake,
  Target,
  Crown,
  Star,
  Network,
  Camera,
  ChevronRight
} from "lucide-react";

export default function ICWLCPage() {
  // Updated leaders array - removed Assistant Coordinator and Evang Eunice F. Olofin
  const icwlcLeaders = [
    { name: "Pastor Tunde Olufemi", role: "Conference Coordinator" }
  ];

  // Conference gallery images - you'll need to place these in public/images/icwlc/
  const galleryImages = [
    {
      src: "/images/icwlc/icwlc1.jpeg",
      alt: "Church workers group photo",
      title: "Conference Attendees"
    },
    {
      src: "/images/icwlc/icwlc2.jpeg",
      alt: "Conference session in progress",
      title: "Interactive Learning Session"
    },
    {
      src: "/images/icwlc/icwlc3.jpeg",
      alt: "Group photo outside church building",
      title: "Conference Attendees"
    },
    {
      src: "/images/icwlc/icwlc4.jpeg",
      alt: "Conference hall with attendees",
      title: "Training Session"
    },
    {
      src: "/images/icwlc/icwlc5.jpeg",
      alt: "Indoor training session",
      title: "Leadership Training"
    },
    {
      src: "/images/icwlc/icwlc6.jpeg",
      alt: "Another conference session",
      title: "Attendees"
    },
    {
      src: "/images/icwlc/icwlc7.jpeg",
      alt: "Fellowship gathering",
      title: "Fellowship & Networking"
    },
    {
      src: "/images/icwlc/icwlc8.jpeg",
      alt: "Prayer session",
      title: "Powerful Prayer Times"
    },
    {
      src: "/images/icwlc/icwlc9.jpeg",
      alt: "Group photo at Baptist church venue",
      title: "Group Photo at Venue"
    },
    {
        src: "/images/icwlc/icwlc10.jpeg",
        alt: "Conference teaching session",
        title: "Teaching Session"
    },
    {
        src: "/images/icwlc/icwlc11.jpeg",
        alt: "Participants during worship",
        title: "Worship & Praise"
    },
    {
        src: "/images/icwlc/icwlc12.jpeg",
        alt: "Conference hall filled with attendees",
        title: "Conference Hall"
    },
    {
        src: "/images/icwlc/icwlc13.jpeg",
        alt: "Group discussion and interaction",
        title: "Group Discussion"
    },
    {
        src: "/images/icwlc/icwlc14.jpeg",
        alt: "Outdoor fellowship and networking",
        title: "Outdoor Fellowship"
    },
    {
        src: "/images/icwlc/icwlc15.jpeg",
        alt: "Prayer and spiritual moments",
        title: "Prayer Time"
    },
    {
        src: "/images/icwlc/icwlc16.jpeg",
        alt: "Church workers collaboration",
        title: "Workers Collaboration"
    },
    {
        src: "/images/icwlc/icwlc17.jpeg",
        alt: "Conference attendees listening attentively",
        title: "Attentive Audience"
    },
    {
        src: "/images/icwlc/icwlc18.jpeg",
        alt: "Unity across denominational lines",
        title: "Unity in Diversity"
    },
  ];

  const conferenceThemes = [
    {
      title: "Leadership Excellence",
      description: "Developing godly leaders for effective church ministry",
      icon: Crown,
      color: "text-white",
      bgColor: "hsl(218, 31%, 18%)"
    },
    {
      title: "Church Growth",
      description: "Strategies for sustainable church growth and expansion",
      icon: Target,
      color: "text-white",
      bgColor: "hsl(45, 56%, 55%)"
    },
    {
      title: "Worker Development",
      description: "Training and equipping church workers for ministry excellence",
      icon: Award,
      color: "text-white",
      bgColor: "hsl(218, 31%, 18%)"
    },
    {
      title: "Unity in Diversity",
      description: "Building bridges across denominational lines",
      icon: Handshake,
      color: "text-white",
      bgColor: "hsl(45, 56%, 55%)"
    }
  ];

  const programs = [
    {
      title: "Annual Conference",
      description: "Main yearly gathering with speakers, workshops, and networking",
      frequency: "Annual - November",
      icon: Globe
    },
    {
      title: "Leadership Summit",
      description: "Intensive training for church leaders and pastors",
      frequency: "Bi-Annual",
      icon: Crown
    },
    {
      title: "Workers Training",
      description: "Specialized sessions for various church ministry workers",
      frequency: "Quarterly",
      icon: Users
    },
    {
      title: "Interdenominational Fellowship",
      description: "Building relationships across different church denominations",
      frequency: "Monthly",
      icon: Handshake
    }
  ];

  const benefits = [
    {
      name: "Networking",
      description: "Connect with church leaders from various denominations",
      color: "text-white",
      bgColor: "hsl(218, 31%, 18%)",
      iconBg: "hsl(218, 31%, 90%)",
      iconColor: "hsl(218, 31%, 18%)",
      icon: Network
    },
    {
      name: "Training",
      description: "Access to quality training and development programs",
      color: "text-white",
      bgColor: "hsl(45, 56%, 55%)",
      iconBg: "hsl(45, 56%, 90%)",
      iconColor: "hsl(45, 56%, 35%)",
      icon: BookOpen
    },
    {
      name: "Resources",
      description: "Sharing of ministry resources and best practices",
      color: "text-white",
      bgColor: "hsl(218, 31%, 18%)",
      iconBg: "hsl(218, 31%, 90%)",
      iconColor: "hsl(218, 31%, 18%)",
      icon: Award
    }
  ];

  const LeaderCard = ({ leader }: { leader: { name: string; role: string } }) => {
    const imagePath = getLeaderImagePath(leader.name);

    return (
      <div className="text-center bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border" style={{borderColor: 'hsl(218, 31%, 85%)'}}>
        <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 shadow-lg" style={{background: 'linear-gradient(to bottom right, hsl(218, 31%, 95%), hsl(218, 31%, 90%))', borderColor: 'hsl(218, 31%, 80%)'}}>
          {imagePath ? (
            <Image
              src={imagePath}
              alt={leader.name}
              fill
              className="object-cover object-[center_top]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, hsl(218, 31%, 95%), hsl(218, 31%, 90%))'}}>
              <Users className="h-16 w-16" style={{color: 'hsl(218, 31%, 18%)'}} />
            </div>
          )}
         </div>
        <h3 className="font-bold text-xl mb-2" style={{color: 'hsl(218, 31%, 18%)'}}>{leader.name}</h3>
        <p className="font-semibold text-lg" style={{color: 'hsl(45, 56%, 55%)'}}>{leader.role}</p>
        <div className="mt-4 flex justify-center">
          <Badge className="px-4 py-1" style={{backgroundColor: 'hsl(218, 31%, 95%)', color: 'hsl(218, 31%, 18%)'}}>
            ICWLC Leadership
          </Badge>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Hero Section */}
      <PageHeader
        title="Interdenominational Church Workers & Leaders Conference"
        subtitle="ICWLC"
        description="Bridging denominational boundaries to unite church workers and leaders in fellowship, training, and mutual support for effective kingdom ministry and the advancement of God's work across all churches."
        backgroundImage="/images/background/icwlc_background.jpg"
        minHeight="md"
        blurBackground={true}
      />

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 space-y-20">

          {/* About Section */}
          <div className="text-center max-w-5xl mx-auto">
            <h2 className="mobile-text-2xl font-bold tracking-tight mb-8">
              About{" "}
              <span className="bg-gradient-to-r from-[hsl(218_31%_18%)] via-[hsl(45_56%_55%)] to-[hsl(218_31%_18%)] bg-clip-text text-transparent">
                ICWLC
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              The Interdenominational Church Worker and Leaders Conference (ICWLC) is a unique
              platform that brings together church workers and leaders from various denominations
              to share experiences, learn from one another, and build lasting relationships that
              transcend denominational barriers for the glory of God.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow" style={{background: 'linear-gradient(to bottom right, hsl(218, 31%, 95%), hsl(218, 31%, 90%))'}}>
                  <Network className="h-10 w-10" style={{color: 'hsl(218, 31%, 18%)'}} />
                </div>
                <h3 className="font-bold text-xl mb-3">Unity</h3>
                <p className="text-gray-600 leading-relaxed">Fostering unity among different denominations</p>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow" style={{background: 'linear-gradient(to bottom right, hsl(45, 56%, 95%), hsl(45, 56%, 85%))'}}>
                  <BookOpen className="h-10 w-10" style={{color: 'hsl(45, 56%, 45%)'}} />
                </div>
                <h3 className="font-bold text-xl mb-3">Learning</h3>
                <p className="text-gray-600 leading-relaxed">Continuous learning and development opportunities</p>
              </div>
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow" style={{background: 'linear-gradient(to bottom right, hsl(218, 31%, 95%), hsl(218, 31%, 90%))'}}>
                  <Star className="h-10 w-10" style={{color: 'hsl(218, 31%, 18%)'}} />
                </div>
                <h3 className="font-bold text-xl mb-3">Excellence</h3>
                <p className="text-gray-600 leading-relaxed">Promoting excellence in church ministry</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <div className="text-center mb-16">
              <h2 className="mobile-text-2xl font-bold tracking-tight mb-6">
                Membership{" "}
                <span className="bg-gradient-to-r from-[hsl(218_31%_18%)] via-[hsl(45_56%_55%)] to-[hsl(218_31%_18%)] bg-clip-text text-transparent">
                  Benefits
                </span>
              </h2>
              <p className="text-xl text-gray-600">What you gain by joining our interdenominational fellowship</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-2 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white" style={{borderColor: 'hsl(218, 31%, 85%)'}}>
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <div className="rounded-full w-16 h-16 flex items-center justify-center" style={{backgroundColor: benefit.iconBg}}>
                        <benefit.icon className="h-8 w-8" style={{color: benefit.iconColor}} />
                      </div>
                    </div>
                    <CardTitle className="text-center">
                      <Badge className="text-lg px-6 py-2" style={{backgroundColor: benefit.bgColor, color: benefit.color}}>
                        {benefit.name}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-center leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Conference Themes */}
          <div>
            <div className="text-center mb-16">
              <h2 className="mobile-text-2xl font-bold tracking-tight mb-6">
                Conference{" "}
                <span className="bg-gradient-to-r from-[hsl(218_31%_18%)] via-[hsl(45_56%_55%)] to-[hsl(218_31%_18%)] bg-clip-text text-transparent">
                  Focus Areas
                </span>
              </h2>
              <p className="text-xl text-gray-600">Key themes and topics we address in our conferences</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {conferenceThemes.map((theme, index) => (
                <Card key={index} className="border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <theme.icon className="h-6 w-6 mr-3" />
                      {theme.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 leading-relaxed">{theme.description}</p>
                    <Badge className="px-3 py-1" style={{backgroundColor: theme.bgColor, color: theme.color}}>
                      Core Theme
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Programs & Events */}
          <div>
            <div className="text-center mb-16">
              <h2 className="mobile-text-2xl font-bold tracking-tight mb-6">
                Programs &{" "}
                <span className="bg-gradient-to-r from-[hsl(218_31%_18%)] via-[hsl(45_56%_55%)] to-[hsl(218_31%_18%)] bg-clip-text text-transparent">
                  Events
                </span>
              </h2>
              <p className="text-xl text-gray-600">Regular conferences and special events throughout the year</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {programs.map((program, index) => (
                <Card key={index} className="border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center" style={{color: 'hsl(218, 31%, 18%)'}}>
                      <program.icon className="h-6 w-6 mr-3" />
                      {program.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-3 leading-relaxed">{program.description}</p>
                    <div className="flex items-center font-semibold" style={{color: 'hsl(45, 56%, 55%)'}}>
                      <Calendar className="h-4 w-4 mr-2" />
                      {program.frequency}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Leadership Team */}
          <div>
            <div className="text-center mb-16">
              <h2 className="mobile-text-2xl font-bold tracking-tight mb-6">
                Our{" "}
                <span className="bg-gradient-to-r from-[hsl(218_31%_18%)] via-[hsl(45_56%_55%)] to-[hsl(218_31%_18%)] bg-clip-text text-transparent">
                  Conference Coordinator
                </span>
              </h2>
              <p className="text-xl text-gray-600">Dedicated leader organizing our interdenominational fellowship</p>
            </div>
            <div className="flex justify-center">
              {icwlcLeaders.map((leader, index) => (
                <LeaderCard key={index} leader={leader} />
              ))}
            </div>
          </div>

          {/* Photo Gallery Section */}
          <div className="rounded-2xl p-8 md:p-12" style={{background: 'linear-gradient(to right, hsl(218, 31%, 18%), hsl(218, 31%, 22%))'}}>
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="rounded-full w-16 h-16 flex items-center justify-center" style={{backgroundColor: 'hsl(45, 56%, 55%)'}}>
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="mobile-text-2xl font-bold tracking-tight mb-6 text-white drop-shadow-lg">
                Conference Memories
              </h2>
              <p className="text-xl text-white mb-4 drop-shadow-md">Some of the pictures from the past Interdenominational Church Workers Conferences</p>
              <p className="text-lg text-gray-200 drop-shadow-md">Witness the unity, fellowship, and spiritual growth from our gatherings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {galleryImages.map((image, index) => (
                <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="aspect-square relative">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <h4 className="font-semibold text-sm leading-tight">{image.title}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-white italic drop-shadow-md">
                "Behold, how good and how pleasant it is for brethren to dwell together in unity!" - Psalm 133:1
              </p>
            </div>
          </div>

          {/* Join Us Section */}
          <div className="relative rounded-2xl overflow-hidden">
            {/* Background Image with Blur */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/icwlc/icwlc10.jpeg"
                alt="Conference Background"
                fill
                className="object-cover filter blur-sm"
              />
              {/* Dark overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70"></div>
            </div>

            <div className="relative z-10 p-8 md:p-12 text-white">
              <div className="text-center mb-12">
                <h2 className="mobile-text-2xl font-bold tracking-tight mb-6 text-white drop-shadow-2xl">Join the Conference</h2>
                <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed drop-shadow-xl">
                  Be part of a movement that unites the Body of Christ across denominational lines
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="group">
                  <div className="bg-white/40 backdrop-blur-md rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <MapPin className="h-10 w-10 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-white drop-shadow-xl">Conference Venue</h3>
                  <p className="text-white leading-relaxed bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 inline-block drop-shadow-lg">
                    TPWBM Church<br />& Partner Locations
                  </p>
                </div>
                <div className="group">
                  <div className="bg-white/40 backdrop-blur-md rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <Clock className="h-10 w-10 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-white drop-shadow-xl">Schedule</h3>
                  <p className="text-white leading-relaxed bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 inline-block drop-shadow-lg">
                    Check Our<br />Event Calendar
                  </p>
                </div>
                <div className="group">
                  <div className="bg-white/40 backdrop-blur-md rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <Globe className="h-10 w-10 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-white drop-shadow-xl">All Welcome</h3>
                  <p className="text-white leading-relaxed bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 inline-block drop-shadow-lg">
                    Every Denomination<br />Every Ministry Level
                  </p>
                </div>
              </div>
              <div className="text-center mt-12">
                <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 max-w-4xl mx-auto shadow-xl">
                  <p className="text-lg text-white mb-6 leading-relaxed drop-shadow-lg">
                    Whether you're a pastor, church worker, or ministry leader, ICWLC provides
                    a platform for growth, networking, and collaborative ministry efforts.
                  </p>
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 inline-block">
                    <p className="text-sm italic text-white drop-shadow-md">
                      "How good and pleasant it is when God's people live together in unity!" - Psalm 133:1
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
