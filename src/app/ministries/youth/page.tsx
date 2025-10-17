import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLeaderImagePath } from "@/lib/leader-images";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
  Zap,
  BookOpen,
  Users,
  Star,
  Music,
  Heart,
  Calendar,
  MapPin,
  Target,
  Award,
  Sparkles,
  Coffee,
  MessageCircle,
  Camera,
  TrendingUp
} from "lucide-react";

export default function YouthMinistryPage() {
  const youthLeaders = [
    { name: "Bro Tunde Adebesin", role: "Youth President" },
    { name: "Bro. David Jacob", role: "Asst. Youth President" },
    { name: "Minister Peace Olufemi", role: "Youth Minister" },
    { name: "Evang. Abiodun Nosiru", role: "Youth Matron" }
  ];

  const programs = [
    {
      title: "Gender Fellowship",
      description: "Monthly gathering where youth sit together to share God's word and fellowship with each other in meaningful discussions",
      frequency: "Once a Month",
      icon: MessageCircle,
      color: "from-[hsl(218,31%,18%)] to-[hsl(218,28%,25%)]",
      bgColor: "bg-[hsl(45,56%,95%)]",
      textColor: "text-[hsl(218,31%,18%)]"
    },
    {
      title: "Teenager & Youth Hangout",
      description: "Annual fun-filled event bringing teens and young adults together for games, worship, and fellowship",
      frequency: "Once a Year",
      icon: Coffee,
      color: "from-[hsl(45,56%,55%)] to-[hsl(45,56%,48%)]",
      bgColor: "bg-[hsl(218,15%,96%)]",
      textColor: "text-[hsl(218,31%,18%)]"
    },
    {
      title: "Youth Conference",
      description: "Transformative annual conference focused on spiritual growth, leadership development, and networking",
      frequency: "Once a Year",
      icon: TrendingUp,
      color: "from-[hsl(218,31%,18%)] to-[hsl(45,56%,55%)]",
      bgColor: "bg-[hsl(45,56%,95%)]",
      textColor: "text-[hsl(218,31%,18%)]"
    }
  ];

  const ageGroups = [
    {
      name: "Teens",
      age: "13-19 years",
      description: "Navigating teenage challenges with biblical guidance and peer support",
      color: "from-[hsl(218,31%,18%)] to-[hsl(218,28%,25%)]",
      bgColor: "bg-[hsl(45,56%,95%)]",
      textColor: "text-[hsl(218,31%,18%)]",
      icon: Sparkles
    },
    {
      name: "Adults",
      age: "20-30 years",
      description: "Building foundations for adulthood with God's direction and community",
      color: "from-[hsl(45,56%,55%)] to-[hsl(45,56%,48%)]",
      bgColor: "bg-[hsl(218,15%,96%)]",
      textColor: "text-[hsl(218,31%,18%)]",
      icon: Target
    }
  ];

  const youthImages = [
    { src: "/images/youth/youth1.jpg", alt: "Youth Conference 2023" },
    { src: "/images/youth/youth2.jpg", alt: "Teen Hangout" },
    { src: "/images/youth/youth3.jpg", alt: "Gender Fellowship" },
    { src: "/images/youth/youth4.jpg", alt: "Youth Worship" },
    { src: "/images/youth/youth5.jpg", alt: "Conference Moments" },
    { src: "/images/youth/youth6.jpg", alt: "Fellowship Time" },
    { src: "/images/youth/youth7.jpg", alt: "Youth Activities" },
    { src: "/images/youth/youth8.jpg", alt: "Group Photo" }
  ];

  const LeaderCard = ({ leader }: { leader: { name: string; role: string } }) => {
    const imagePath = getLeaderImagePath(leader.name);

    return (
        <div className="text-center group">
          <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-[hsl(45,56%,95%)] to-[hsl(218,15%,96%)] border-4 border-transparent bg-clip-padding shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(45,56%,55%)] to-[hsl(218,31%,18%)] rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            {imagePath ? (
                <Image
                    src={imagePath}
                    alt={leader.name}
                    fill
                    className="object-cover relative z-10"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-[hsl(45,56%,90%)] to-[hsl(218,15%,90%)] flex items-center justify-center relative z-10">
                  <Users className="h-12 w-12 text-[hsl(218,31%,18%)]" />
                </div>
            )}
          </div>
          <h3 className="font-bold mobile-text-base text-[hsl(218,31%,18%)] group-hover:text-[hsl(45,56%,55%)] transition-colors duration-300">{leader.name}</h3>
          <p className="text-transparent bg-gradient-to-r from-[hsl(218,31%,18%)] to-[hsl(218,28%,25%)] bg-clip-text font-semibold">{leader.role}</p>
        </div>
    );
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-white via-[hsl(45,56%,98%)] to-[hsl(218,15%,98%)]">
        {/* Hero Section */}
        <section className="relative text-white py-6 md:py-8 overflow-hidden">
          {/* Background with multiple overlays for depth */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/background/youth_background.jpg"
              alt="Youth Ministry Background"
              fill
              className="object-cover opacity-50 blur-sm"
              priority
            />
            {/* Enhanced overlay for depth - very light overlay for maximum brightness */}
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(218,31%,18%)]/15 via-transparent to-[hsl(218,31%,18%)]/20 z-1" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(218,31%,18%)]/10 to-[hsl(218,31%,18%)]/15 z-1" />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="text-center space-y-6 md:space-y-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[hsl(45,56%,55%)] to-[hsl(218,31%,18%)] rounded-full flex items-center justify-center mx-auto mb-6 animate-in fade-in slide-in-from-top duration-1000 delay-200 drop-shadow-lg">
                <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h1 className="mobile-text-3xl font-bold mb-4 md:mb-6 text-white drop-shadow-2xl animate-in fade-in slide-in-from-top duration-1000 delay-400">
                Youth Ministry
              </h1>
              <p className="mobile-text-lg text-gray-100 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-lg animate-in fade-in slide-in-from-top duration-1000 delay-600">
                🔥 Igniting young hearts to live boldly for Christ through dynamic fellowship,
                authentic community, and purpose-driven discipleship! ✨
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-in fade-in slide-in-from-top duration-1000 delay-800">
                <Button size="lg" className="bg-gradient-to-r from-[hsl(45,56%,55%)] to-[hsl(45,56%,48%)] hover:from-[hsl(45,56%,48%)] hover:to-[hsl(45,56%,42%)] text-[hsl(218,31%,18%)] font-bold px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
                  <Heart className="h-5 w-5 mr-2" />
                  Join Our Family!
                </Button>
                <div className="flex items-center text-white drop-shadow-md">
                  <Users className="h-5 w-5 mr-2" />
                  <span className="font-medium">Ages 13-30 Welcome</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 space-y-20">

            {/* About Section */}
            <AnimatedSection animation="fadeUp">
              <div className="text-center max-w-5xl mx-auto">
                <h2 className="mobile-text-2xl font-bold text-[hsl(218,31%,18%)] mb-6">
                  About Our Youth Ministry
                </h2>
                <p className="mobile-text-lg text-[hsl(218,15%,40%)] mb-12 leading-relaxed">
                  Our Youth Ministry is a vibrant, energetic community where young people discover their identity in Christ,
                  build lasting friendships, and are equipped to make a difference in their generation.
                  We believe every young person has a unique calling and purpose in God's kingdom! 🚀
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center group cursor-pointer">
                    <div className="bg-gradient-to-br from-[hsl(45,56%,95%)] to-[hsl(45,56%,90%)] rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <Zap className="h-10 w-10 text-[hsl(218,31%,18%)]" />
                    </div>
                    <h3 className="font-bold mobile-text-lg mb-3 text-[hsl(218,31%,18%)]">Dynamic Faith</h3>
                    <p className="text-[hsl(218,15%,40%)]">Building a passionate relationship with Jesus through authentic worship and study</p>
                  </div>
                  <div className="text-center group cursor-pointer">
                    <div className="bg-gradient-to-br from-[hsl(218,15%,96%)] to-[hsl(218,15%,92%)] rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <Heart className="h-10 w-10 text-[hsl(45,56%,55%)]" />
                    </div>
                    <h3 className="font-bold mobile-text-lg mb-3 text-[hsl(218,31%,18%)]">Authentic Community</h3>
                    <p className="text-[hsl(218,15%,40%)]">Creating lasting friendships and support systems that encourage growth</p>
                  </div>
                  <div className="text-center group cursor-pointer">
                    <div className="bg-gradient-to-br from-[hsl(45,56%,95%)] to-[hsl(45,56%,90%)] rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <Target className="h-10 w-10 text-[hsl(218,31%,18%)]" />
                    </div>
                    <h3 className="font-bold mobile-text-lg mb-3 text-[hsl(218,31%,18%)]">Purpose-Driven</h3>
                    <p className="text-[hsl(218,15%,40%)]">Discovering and fulfilling God's calling with passion and excellence</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Age Groups */}
            <AnimatedSection animation="fadeUp">
              <div>
                <div className="text-center mb-12">
                  <h2 className="mobile-text-2xl font-bold text-[hsl(218,31%,18%)] mb-4">
                    Age Groups
                  </h2>
                  <p className="mobile-text-lg text-[hsl(218,15%,40%)]">Tailored programs for different life stages and experiences</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {ageGroups.map((group, index) => (
                      <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white overflow-hidden">
                        <div className={`h-2 bg-gradient-to-r ${group.color}`}></div>
                        <CardHeader className="text-center pb-4">
                          <div className={`w-16 h-16 bg-gradient-to-br ${group.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                            <group.icon className="h-8 w-8 text-white" />
                          </div>
                          <CardTitle className="text-2xl font-bold">
                            <span className={`bg-gradient-to-r ${group.color} bg-clip-text text-transparent`}>
                              {group.name}
                            </span>
                            <p className="text-lg text-[hsl(218,15%,40%)] mt-2 font-normal">{group.age}</p>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-[hsl(218,15%,40%)] text-center text-lg">{group.description}</p>
                        </CardContent>
                      </Card>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Special Programs */}
            <AnimatedSection animation="fadeUp">
              <div>
                <div className="text-center mb-12">
                  <h2 className="mobile-text-2xl font-bold text-[hsl(218,31%,18%)] mb-4">
                    Special Programs
                  </h2>
                  <p className="mobile-text-lg text-[hsl(218,15%,40%)]">Exciting events and opportunities throughout the year</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {programs.map((program, index) => (
                      <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white overflow-hidden group">
                        <div className={`h-3 bg-gradient-to-r ${program.color}`}></div>
                        <CardHeader className="text-center">
                          <div className={`w-20 h-20 bg-gradient-to-br ${program.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <program.icon className="h-10 w-10 text-white" />
                          </div>
                          <CardTitle className="text-xl font-bold text-[hsl(218,31%,18%)] mb-2">
                            {program.title}
                          </CardTitle>
                          <Badge className={`${program.bgColor} ${program.textColor} px-4 py-2 font-semibold border-0`}>
                            {program.frequency}
                          </Badge>
                        </CardHeader>
                        <CardContent>
                          <p className="text-[hsl(218,15%,40%)] text-center leading-relaxed">{program.description}</p>
                        </CardContent>
                      </Card>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Youth Gallery */}
            <AnimatedSection animation="fadeUp">
              <div>
                <div className="text-center mb-12">
                  <h2 className="mobile-text-2xl font-bold text-[hsl(218,31%,18%)] mb-4">
                    Our Moments
                  </h2>
                  <p className="mobile-text-lg text-[hsl(218,15%,40%)]">Memories from our conferences, hangouts, and fellowship times</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {youthImages.map((image, index) => (
                      <div key={index} className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        <div className="aspect-square relative">
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(218,31%,18%)]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <p className="text-sm font-semibold drop-shadow-lg">{image.alt}</p>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Leadership Team */}
            <AnimatedSection animation="fadeUp">
              <div>
                <div className="text-center mb-12">
                  <h2 className="mobile-text-2xl font-bold text-[hsl(218,31%,18%)] mb-4">
                    Our Leadership Team
                  </h2>
                  <p className="mobile-text-lg text-[hsl(218,15%,40%)]">Passionate leaders guiding and inspiring our youth ministry</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {youthLeaders.map((leader, index) => (
                      <LeaderCard key={index} leader={leader} />
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Join Section */}
            <AnimatedSection animation="fadeUp">
              <div className="bg-gradient-to-br from-[hsl(45,56%,98%)] via-[hsl(45,56%,96%)] to-[hsl(218,15%,98%)] rounded-3xl p-8 md:p-12 shadow-2xl">
                <div className="text-center mb-10">
                  <h2 className="mobile-text-2xl font-bold text-[hsl(218,31%,18%)] mb-4">
                    Join Our Youth Family
                  </h2>
                  <p className="mobile-text-lg text-[hsl(218,15%,40%)]">Be part of a community that will challenge, inspire, and transform you! 🔥</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="text-center group">
                    <div className="bg-white rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <MapPin className="h-10 w-10 text-[hsl(218,31%,18%)]" />
                    </div>
                    <h3 className="font-bold mobile-text-lg mb-3 text-[hsl(218,31%,18%)]">Location</h3>
                    <p className="text-lg text-[hsl(218,15%,40%)]">TPWBM Church</p>
                  </div>
                  <div className="text-center group">
                    <div className="bg-white rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                      <Users className="h-10 w-10 text-[hsl(45,56%,55%)]" />
                    </div>
                    <h3 className="font-bold mobile-text-lg mb-3 text-[hsl(218,31%,18%)]">Age Range</h3>
                    <p className="text-lg text-[hsl(218,15%,40%)]">Ages 13-30<br />All Welcome</p>
                  </div>
                </div>
                <div className="text-center mt-10">
                  <p className="text-lg text-[hsl(218,15%,40%)] mb-6 max-w-3xl mx-auto leading-relaxed">
                    Ready to take your faith to the next level? Join us for dynamic worship,
                    meaningful fellowship, and life-changing encounters with God! ✨
                  </p>
                  <div className="bg-white/50 rounded-2xl p-6 max-w-2xl mx-auto">
                    <p className="text-base text-[hsl(218,15%,40%)] italic font-medium">
                      "Don't let anyone look down on you because you are young, but set an example
                      for the believers in speech, in conduct, in love, in faith and in purity."
                    </p>
                    <p className="text-sm text-[hsl(218,15%,40%)] mt-2 font-semibold">- 1 Timothy 4:12</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

          </div>
        </section>
      </div>
  );
}
