import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Users, Calendar, Heart, Mic, Piano } from "lucide-react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import Link from "next/link";
import { AnimatedSection } from "@/components/ui/animated-section";
import Image from "next/image";
import { getLeaderImagePath } from "@/lib/leader-images";

export default function MusicMinistryPage() {
  const musicLeaders = [
    { name: "Mrs. Temitayo Adeosun", role: "Music Ministry Leader" },
    { name: "Bro Praise Olufemi", role: "Assistant Music Ministry Leader" }
  ];

  const LeaderCard = ({ leader }: { leader: { name: string; role: string } }) => {
    const imagePath = getLeaderImagePath(leader.name);

    return (
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 border-4 border-secondary/30">
            {imagePath ? (
                <Image
                    src={imagePath}
                    alt={leader.name}
                    fill
                    className="object-cover"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-secondary/20 to-secondary/30 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
            )}
          </div>
          <h3 className="font-semibold text-lg text-primary">{leader.name}</h3>
          <p className="text-secondary font-medium">{leader.role}</p>
        </div>
    );
  };

  return (
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="w-full py-6 md:py-8 bg-gradient-to-r from-primary via-primary to-primary/90 text-white relative overflow-hidden">
          {/* Background Image with Blur */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/music/music_background.jpg"
              alt="Music Ministry Background"
              fill
              className="object-cover opacity-40 blur-md"
              priority
            />
          </div>

          {/* Enhanced overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40 z-1" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/30 z-1" />

          <div className="container px-4 md:px-6 relative z-10">
            <div className="text-center space-y-6 md:space-y-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center mx-auto mb-6 animate-in fade-in slide-in-from-top duration-1000 delay-200 drop-shadow-lg">
                <Music className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 md:mb-6 bg-gradient-to-r from-white via-white/80 to-white bg-clip-text text-transparent drop-shadow-2xl animate-in fade-in slide-in-from-top duration-1000 delay-400">
                Music Ministry
              </h1>
              <p className="text-lg sm:text-xl text-gray-100 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg animate-in fade-in slide-in-from-top duration-1000 delay-600">
                Using the gift of music to enhance worship, praise, and create meaningful spiritual experiences for our church family
              </p>
            </div>
          </div>
        </section>

        {/* About Music Ministry */}
        <AnimatedSection animation="fadeUp">
          <section className="w-full py-16 md:py-24 bg-gradient-to-b from-white via-white to-gray-50">
            <div className="container px-4 md:px-6">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 pt-0">
                  <h2 className="text-3xl font-bold text-primary mb-4">
                    Our Calling
                  </h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    The Music Ministry at The Prevailing Word Believers Ministry Inc. is dedicated to leading God's people into His presence through powerful worship and praise. We believe that music is a divine gift that opens hearts, lifts spirits, and creates an atmosphere where God can move freely.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Our team of passionate musicians and singers work together to prepare hearts for receiving God's Word and to create moments of intimate worship that transform lives.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      <Users className="h-5 w-5 mr-2" />
                      Join Our Team
                    </Button>
                    <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                      <Calendar className="h-5 w-5 mr-2" />
                      Practice Schedule
                    </Button>
                  </div>
                </div>
                <div className="relative group">
                  <div className="aspect-[5/3] rounded-3xl overflow-hidden shadow-2xl w-full relative bg-gradient-to-br from-secondary/20 to-secondary/30 p-1">
                    {/* Gradient border effect */}
                    <div className="w-full h-full rounded-2xl overflow-hidden relative">
                      <ImageWithFallback
                          src="/images/music/music_cover.jpg"
                          alt="Music Ministry Team"
                          fill
                          className="object-cover object-[center_15%] transition-transform duration-700 group-hover:scale-105"
                          fallbackIcon={<Music className="h-20 w-20 text-white/50" />}
                          fallbackBgColor="bg-gradient-to-br from-primary to-secondary"
                      />

                      {/* Enhanced gradient overlay for better text visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Caption overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                        <p className="text-white text-lg font-semibold">Our Music Ministry Team</p>
                        <p className="text-white/80 text-sm mt-1">Leading worship with passion and excellence</p>
                      </div>
                    </div>

                    {/* Enhanced floating music note icon */}
                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                      <Music className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Our Leadership Team */}
        <AnimatedSection animation="fadeUp">
          <section className="w-full py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
            <div className="container px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="mobile-text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-4">
                  Our Leadership Team
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Passionate leaders guiding our music ministry
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                {musicLeaders.map((leader, index) => (
                    <LeaderCard key={index} leader={leader} />
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Our Teams */}
        <AnimatedSection animation="fadeUp">
          <section className="w-full py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
            <div className="container px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="mobile-text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-4">
                  Our Teams
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Different teams working together to create beautiful worship experiences
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-primary/20">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Mic className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-primary">Worship Team</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-4">
                      Lead vocals and harmonies that guide the congregation into worship and praise
                    </p>
                    <p className="text-sm text-secondary font-medium">Sundays & Special Events</p>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-primary/20">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Piano className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-primary">Instrumentalists</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-4">
                      Keyboard, drums, and other instruments creating the musical foundation
                    </p>
                    <p className="text-sm text-secondary font-medium">Keyboards  • Drums</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Practice Schedule */}
        <AnimatedSection animation="fadeUp">
          <section className="w-full py-16 md:py-24 bg-gradient-to-b from-gray-50 to-secondary/5">
            <div className="container px-4 md:px-6">
              <div className="text-center mb-12">
                <h2 className="mobile-text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-4">
                  Practice{" "}<span className="bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent">Schedule</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Practice sessions for worship team and instrumentalists
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <Card className="border-l-4 border-l-secondary shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-center justify-center text-primary">
                      <Calendar className="h-5 w-5 text-secondary" />
                      Music Ministry Practice
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-2">
                      <strong>When:</strong> Saturdays 4:00 PM </p>
                    <p> Sundays - Immediately after Church Service </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Where:</strong> Main Sanctuary
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Join Our Team */}
        <AnimatedSection animation="fadeUp">
          <section className="w-full py-16 md:py-24 bg-gradient-to-r from-primary via-primary/95 to-primary text-white relative overflow-hidden">
            {/* Background Image with Blur */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/music/music_background.jpg"
                alt="Music Ministry Background"
                fill
                className="object-cover opacity-30 blur-md"
              />
            </div>

            {/* Light overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/25 z-1" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-primary/15 z-1" />

            <div className="container px-4 md:px-6 relative z-10">
              <div className="text-center space-y-8">
                <h2 className="text-3xl font-bold mb-4 text-white drop-shadow-2xl">
                  Join Our Music Ministry
                </h2>
                <p className="text-xl text-gray-100 max-w-3xl mx-auto">
                  Whether you sing, play an instrument, or have a heart for worship, there's a place for you in our music ministry. Come and be part of something beautiful!
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button
                      size="lg"
                      variant="secondary"
                      className="bg-white text-primary hover:bg-gray-100"
                  >
                    <Users className="h-5 w-5 mr-2" />
                    Contact Ministry Leader
                  </Button>
                  <Link href="/contact">
                    <Button
                        size="lg"
                        variant="secondary"
                        className="bg-secondary text-white hover:bg-secondary/90"
                    >
                      <Heart className="h-5 w-5 mr-2" />
                      Get In Touch
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </div>
  );
}
