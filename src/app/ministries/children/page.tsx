"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Loader2 } from "lucide-react";
import type { CloudinaryGalleryImage } from "@/lib/cloudinary-client";
import { getCloudinaryImageUrl, churchImages } from "@/lib/cloudinary-client";
import {
  Heart,
  BookOpen,
  Users,
  Star,
  Music,
  Palette,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

export default function ChildrenMinistryPage() {
  const [childrenImages, setChildrenImages] = useState<CloudinaryGalleryImage[]>([]);
  const [leaderImages, setLeaderImages] = useState<CloudinaryGalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load Cloudinary images on component mount
  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      try {
        // Fetch children images and leader images in parallel
        const [childrenImagesData, leaderImagesData] = await Promise.all([
          fetch('/api/cloudinary/images?subfolder=children')
              .then(res => res.json())
              .then(data => data.images || []),
          fetch('/api/cloudinary/images?subfolder=leaders')
              .then(res => res.json())
              .then(data => data.images || [])
        ]);

        setChildrenImages(childrenImagesData);
        setLeaderImages(leaderImagesData);
      } catch (error) {
        console.error('Error loading images from Cloudinary:', error);
        setChildrenImages([]);
        setLeaderImages([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, []);

  const childrenLeaders = [
    { name: "Mrs Kehinde Komolafe", role: "Children Ministry Coordinator" },
    { name: "Mrs Toyin Obasi", role: "Assistant Coordinator" }
  ];

  const activities = [
    {
      title: "Sunday School",
      description: "Bible lessons every Sunday for all ages",
      time: "9:00 AM - 10:00 AM",
      icon: BookOpen,
      color: "text-white",
      bgColor: "hsl(218, 31%, 18%)"
    },
    {
      title: "Children's Worship",
      description: "Interactive worship sessions with songs and prayers",
      time: "10:30 AM - 11:15 AM",
      icon: Music,
      color: "text-white",
      bgColor: "hsl(45, 56%, 55%)"
    }
  ];

  const programs = [
    {
      title: "Children Convention",
      description: "Annual transformative gathering for spiritual growth and fun activities",
      frequency: "Annual - August"
    },
    {
      title: "Children's Christmas Program",
      description: "Special Christmas presentation by our children",
      frequency: "Annual - December"
    }
  ];

  const ageGroups = [
    {
      name: "Little Lambs",
      age: "2-4 years",
      description: "Nursery care with basic Bible stories and songs",
      color: "text-white",
      bgColor: "hsl(218, 31%, 18%)"
    },
    {
      name: "God's Little Angels",
      age: "5-7 years",
      description: "Interactive Bible lessons with crafts and activities",
      color: "text-white",
      bgColor: "hsl(45, 56%, 55%)"
    },
    {
      name: "Young Disciples",
      age: "8-12 years",
      description: "Deeper Bible study with practical life applications",
      color: "text-white",
      bgColor: "hsl(218, 31%, 18%)"
    }
  ];

  // Helper function to find leader image by name
  const findLeaderImage = (leaderName: string): CloudinaryGalleryImage | undefined => {
    return leaderImages.find(img => {
      const imageName = img.alt.toLowerCase();
      const searchName = leaderName.toLowerCase();

      // Remove common prefixes and check for matches
      const cleanSearchName = searchName
          .replace(/mrs\.\s+/g, '')
          .replace(/mrs\s+/g, '');

      const cleanImageName = imageName
          .replace(/mrs\s+/g, '');

      // Check if names match (partial or full)
      return cleanImageName.includes(cleanSearchName) || cleanSearchName.includes(cleanImageName);
    });
  };

  const LeaderCard = ({ leader }: { leader: { name: string; role: string } }) => {
    const leaderImage = findLeaderImage(leader.name);

    return (
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 border-4" style={{borderColor: 'hsl(218, 31%, 80%)'}}>
            {leaderImage ? (
                <Image
                    src={leaderImage.src}
                    alt={leader.name}
                    fill
                    className="object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center" style={{background: 'linear-gradient(to bottom right, hsl(218, 31%, 95%), hsl(218, 31%, 90%))'}}>
                  <Users className="h-12 w-12" style={{color: 'hsl(218, 31%, 18%)'}} />
                </div>
            )}
          </div>
          <h3 className="font-semibold mobile-text-lg text-[hsl(218,31%,18%)]">{leader.name}</h3>
          <p className="font-medium text-[hsl(45,56%,55%)]">{leader.role}</p>
          {leaderImage && (
              <Badge variant="outline" className="text-xs mt-1">
                Cloudinary
              </Badge>
          )}
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      {/* Breadcrumbs */}
      <Breadcrumbs />

      {/* Hero Section */}
      <PageHeader
        title="Children's Ministry"
        description="Nurturing young hearts and minds in God's love through engaging Bible lessons, worship, and fellowship in a safe and caring environment."
        backgroundImage={getCloudinaryImageUrl(churchImages.children.children1, {
          width: 1920,
          height: 1080,
          crop: 'fill',
          quality: 'auto',
          format: 'auto'
        })}
        minHeight="sm"
        overlay="medium"
        blurBackground={true}
      />

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 space-y-16">

          {/* About Section */}
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="mobile-text-2xl font-bold mb-4 tracking-tight">
              About Our Children's{" "}
              <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                Ministry
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto mb-6" />
            <p className="mobile-text-lg text-[hsl(218,15%,40%)] mb-8 leading-relaxed">
              Our Children's Ministry is dedicated to creating a loving, safe, and fun environment where
              children can grow in their relationship with Jesus Christ. We believe every child is precious
              to God and has a unique purpose in His kingdom.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group cursor-pointer">
                <div className="bg-gradient-to-br from-[hsl(218,31%,95%)] to-[hsl(218,31%,90%)] rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Heart className="h-10 w-10 text-[hsl(218,31%,18%)]" />
                </div>
                <h3 className="font-bold mobile-text-lg mb-3 text-[hsl(218,31%,18%)]">Love of Christ</h3>
                <p className="text-[hsl(218,15%,40%)]">Teaching children about God's unconditional love</p>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="bg-gradient-to-br from-[hsl(45,56%,95%)] to-[hsl(45,56%,90%)] rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <BookOpen className="h-10 w-10 text-[hsl(45,56%,35%)]" />
                </div>
                <h3 className="font-bold mobile-text-lg mb-3 text-[hsl(218,31%,18%)]">Bible Learning</h3>
                <p className="text-[hsl(218,15%,40%)]">Bible stories and lessons for all ages</p>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="bg-gradient-to-br from-[hsl(218,31%,95%)] to-[hsl(218,31%,90%)] rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Users className="h-10 w-10 text-[hsl(218,31%,18%)]" />
                </div>
                <h3 className="font-bold mobile-text-lg mb-3 text-[hsl(218,31%,18%)]">Community</h3>
                <p className="text-[hsl(218,15%,40%)]">Building friendships and fellowship</p>
              </div>
            </div>
          </div>

          {/* Ministry Leaders */}
          <div>
            <div className="text-center mb-12">
              <h2 className="mobile-text-2xl font-bold mb-4 tracking-tight">
                Ministry{" "}
                <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                  Leaders
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto mb-4" />
              <p className="text-[hsl(218,15%,40%)]">Meet the dedicated leaders who guide our children</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">
              {childrenLeaders.map((leader, index) => (
                  <LeaderCard key={index} leader={leader} />
              ))}
            </div>
          </div>

          {/* Age Groups */}
          <div>
            <div className="text-center mb-12">
              <h2 className="mobile-text-2xl font-bold mb-4 tracking-tight">
                Age{" "}
                <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                  Groups
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto mb-4" />
              <p className="text-[hsl(218,15%,40%)]">We have programs tailored for different age groups</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {ageGroups.map((group, index) => (
                  <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${group.bgColor === 'hsl(218, 31%, 18%)' ? 'from-[hsl(218,31%,18%)] to-[hsl(218,28%,25%)]' : 'from-[hsl(45,56%,55%)] to-[hsl(45,56%,48%)]'}`}></div>
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 ${group.bgColor === 'hsl(218, 31%, 18%)' ? 'bg-gradient-to-br from-[hsl(218,31%,18%)] to-[hsl(218,28%,25%)]' : 'bg-gradient-to-br from-[hsl(45,56%,55%)] to-[hsl(45,56%,48%)]'} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold">
                        <span className={`${group.bgColor === 'hsl(218, 31%, 18%)' ? 'bg-gradient-to-r from-[hsl(218,31%,18%)] to-[hsl(218,28%,25%)]' : 'bg-gradient-to-r from-[hsl(45,56%,55%)] to-[hsl(45,56%,48%)]'} bg-clip-text text-transparent`}>
                          {group.name}
                        </span>
                        <p className="text-lg text-[hsl(218,15%,40%)] mt-2 font-normal">{group.age}</p>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[hsl(218,15%,40%)] text-center">{group.description}</p>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </div>

          {/* Weekly Activities */}
          <div>
            <div className="text-center mb-12">
              <h2 className="mobile-text-2xl font-bold mb-4 tracking-tight">
                Weekly{" "}
                <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                  Activities
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto mb-4" />
              <p className="text-[hsl(218,15%,40%)]">Engaging activities that make learning about God fun</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {activities.map((activity, index) => (
                  <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white overflow-hidden group">
                    <div className={`h-3 bg-gradient-to-r ${activity.bgColor === 'hsl(218, 31%, 18%)' ? 'from-[hsl(218,31%,18%)] to-[hsl(218,28%,25%)]' : 'from-[hsl(45,56%,55%)] to-[hsl(45,56%,48%)]'}`}></div>
                    <CardHeader className="text-center">
                      <div className={`w-20 h-20 ${activity.bgColor === 'hsl(218, 31%, 18%)' ? 'bg-gradient-to-br from-[hsl(218,31%,18%)] to-[hsl(218,28%,25%)]' : 'bg-gradient-to-br from-[hsl(45,56%,55%)] to-[hsl(45,56%,48%)]'} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <activity.icon className="h-10 w-10 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-[hsl(218,31%,18%)] mb-2">
                        {activity.title}
                      </CardTitle>
                      <Badge className={`${activity.bgColor === 'hsl(218, 31%, 18%)' ? 'bg-[hsl(45,56%,95%)] text-[hsl(218,31%,18%)]' : 'bg-[hsl(218,15%,96%)] text-[hsl(218,31%,18%)]'} px-4 py-2 font-semibold border-0`}>
                        {activity.time}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[hsl(218,15%,40%)] text-center leading-relaxed">{activity.description}</p>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </div>

          {/* Special Programs */}
          <div>
            <div className="text-center mb-12">
              <h2 className="mobile-text-2xl font-bold mb-4 tracking-tight">
                Special{" "}
                <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                  Programs
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto mb-4" />
              <p className="text-[hsl(218,15%,40%)]">Annual events and special celebrations</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {programs.map((program, index) => (
                  <div key={index} className="relative bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3 group overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className={`w-full h-full bg-gradient-to-br ${index % 2 === 0 ? 'from-[hsl(45,56%,55%)] to-[hsl(45,56%,48%)]' : 'from-[hsl(218,31%,18%)] to-[hsl(218,28%,25%)]'}`}></div>
                    </div>

                    {/* Corner Accent */}
                    <div className={`absolute top-0 right-0 w-24 h-24 ${index % 2 === 0 ? 'bg-gradient-to-bl from-[hsl(45,56%,55%)] to-transparent' : 'bg-gradient-to-bl from-[hsl(218,31%,18%)] to-transparent'} rounded-bl-3xl opacity-20`}></div>

                    <div className="relative z-10">
                      {/* Icon and Title */}
                      <div className="flex items-center mb-6">
                        <div className={`w-16 h-16 ${index % 2 === 0 ? 'bg-gradient-to-br from-[hsl(45,56%,55%)] to-[hsl(45,56%,48%)]' : 'bg-gradient-to-br from-[hsl(218,31%,18%)] to-[hsl(218,28%,25%)]'} rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Calendar className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="mobile-text-lg font-bold text-[hsl(218,31%,18%)] mb-1">{program.title}</h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${index % 2 === 0 ? 'bg-[hsl(45,56%,95%)] text-[hsl(45,56%,35%)]' : 'bg-[hsl(218,31%,95%)] text-[hsl(218,31%,35%)]'}`}>
                            {program.frequency}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[hsl(218,15%,40%)] leading-relaxed text-lg">{program.description}</p>

                      {/* Decorative Element */}
                      <div className={`w-12 h-1 ${index % 2 === 0 ? 'bg-gradient-to-r from-[hsl(45,56%,55%)] to-[hsl(45,56%,48%)]' : 'bg-gradient-to-r from-[hsl(218,31%,18%)] to-[hsl(218,28%,25%)]'} rounded-full mt-6 group-hover:w-20 transition-all duration-300`}></div>
                    </div>
                  </div>
              ))}
            </div>
          </div>


          {/* Children's Photo Gallery from Cloudinary */}
          {childrenImages.length > 0 && (
              <div>
                <div className="text-center mb-12">
                  <h2 className="mobile-text-2xl font-bold mb-4 tracking-tight">
                    Children's Ministry{" "}
                    <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                      Gallery
                    </span>
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto mb-4" />
                  <p className="text-[hsl(218,15%,40%)]">See our children in action during ministry activities</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {childrenImages
                    .filter(image => {
                      const altText = image.alt.toLowerCase();
                      const titleText = image.title?.toLowerCase() || '';
                      // Filter out Pastor's resource images that should not appear in children gallery
                      return !altText.includes('nurturing') &&
                             !titleText.includes('nurturing') &&
                             !altText.includes('god\'s own way') &&
                             !titleText.includes('god\'s own way') &&
                             !altText.includes('pastor') &&
                             !titleText.includes('pastor') &&
                             !altText.includes('kehinde') &&
                             !titleText.includes('kehinde');
                    })
                    .slice(0, 6)
                    .map((image, index) => (
                      <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                              src={image.src}
                              alt={image.alt}
                              fill
                              className="object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className="text-white text-xs" style={{backgroundColor: 'hsl(218, 31%, 18%)'}}>
                              Cloudinary
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-sm">{image.title}</h3>
                          <p className="text-xs text-gray-600 mt-1">{image.date}</p>
                        </CardContent>
                      </Card>
                  ))}
                </div>
              </div>
          )}

          {/* Get Involved Section */}
              <div className="relative rounded-2xl p-8 md:p-12 overflow-hidden shadow-2xl">
                  {/* Background with gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[hsl(218,31%,18%)] via-[hsl(218,28%,25%)] to-[hsl(218,31%,15%)]"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[hsl(45,56%,55%)]/10 via-transparent to-[hsl(45,56%,55%)]/10"></div>

                    <div className="relative z-10 text-center mb-8">
                      <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">Get Involved</h2>
                      <p className="text-gray-200 leading-relaxed">
                        We welcome children of all ages and backgrounds. Contact us to learn more or volunteer!
                      </p>
                    </div>

                    <div className="relative z-10 grid md:grid-cols-2 gap-8 text-center max-w-2xl mx-auto">
                      <div className="group">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                          <Mail className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="font-semibold mb-2 text-white mobile-text-lg">Email Us</h3>
                        <p className="text-gray-200">children@tpwbm.org</p>
                      </div>
                      <div className="group">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                          <MapPin className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="font-semibold mb-2 text-white mobile-text-lg">Visit Us</h3>
                        <p className="text-gray-200">Every Sunday at 9:00 AM</p>
                      </div>
                  </div>
              </div>


        </div>
      </section>
    </div>
  );
}
