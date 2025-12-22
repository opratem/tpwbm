import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLeaderImagePath, getFallbackImage } from "@/lib/leader-images";
import LeaderCard from "@/components/LeaderCard";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import {
  Users,
  Crown,
  Heart,
  Star,
  Shield,
  BookOpen,
  Music,
  Megaphone,
  Camera,
  Mic,
  Home,
  MapPin
} from "lucide-react";

interface Leader {
  name: string;
  position?: string;
  icon?: any;
}

interface Ministry {
  name: string;
  leaders: Leader[];
  icon: any;
  color: string;
}

export default function LeadershipPage() {
  const boardOfTrustees: Leader[] = [
    { name: "Pastor Tunde Olufemi", position: "Chairman" },
    { name: "Pastor Esther Olufemi" },
    { name: "Dn. (Dr) Ope Olumade" },
    { name: "Dn. Lawrence S. Komolafe" },
    { name: "Evang. Abiodun Nosiru" }
  ];

  const pastors: Leader[] = [
    { name: "Pastor Tunde Olufemi" },
    { name: "Pastor Esther Olufemi" }
  ];

  const evangelists: Leader[] = [
    { name: "Evang. Eunice F. Olofin" },
    { name: "Evang. Abiodun Nosiru" }
  ];

  const ministers: Leader[] = [
    { name: "Minister Peace Olufemi" }
  ];

  const deaconate: Leader[] = [
    { name: "Dn. Sam. O Sofowora" },
    { name: "Dns. Titilayo A. Bankole" },
    { name: "Dn. Lawrence S. Komolafe" }
  ];

  const ministries: Ministry[] = [
    {
      name: "Children Ministry",
      leaders: [
        { name: "Mrs Kehinde Komolafe" },
        { name: "Mrs Toyin Obasi" }
      ],
      icon: Heart,
      color: "bg-pink-100 text-pink-800"
    },
    {
      name: "Teen and Youth Ministry",
      leaders: [
        { name: "Bro Tunde Adebesin", position: "Youth President" },
        { name: "Bro. David Jacob", position: "Asst. Youth President" },
        { name: "Minister Peace Olufemi", position: "Youth Minister" },
        { name: "Evang. Abiodun Nosiru", position: "Youth Matron" }
      ],
      icon: Star,
      color: "bg-secondary/20 text-primary"
    },
    {
      name: "Men Ministry",
      leaders: [
        { name: "Dn. Lawrence S. Komolafe" }
      ],
      icon: Shield,
      color: "bg-primary/10 text-primary"
    },
    {
      name: "Women Ministry",
      leaders: [
        { name: "Mrs. Ruth M. Oluwole", position: "Peculiar" },
        { name: "Mrs. Bola Komolafe", position: "Victory Sister" }
      ],
      icon: Crown,
      color: "bg-secondary/10 text-secondary-foreground"
    },
    {
      name: "Sunday School",
      leaders: [
        { name: "Dn Sam Sofowora" }
      ],
      icon: BookOpen,
      color: "bg-accent/10 text-accent-foreground"
    },
    {
      name: "Ushering",
      leaders: [
        { name: "Mrs. Yemisi Ajayi" }
      ],
      icon: Users,
      color: "bg-primary/10 text-primary"
    },
    {
      name: "Evangelism Team",
      leaders: [
        { name: "Evang. Abiodun Nosiru" },
        { name: "Minister Peace Olufemi" }
      ],
      icon: Megaphone,
      color: "bg-secondary/10 text-secondary-foreground"
    },
    {
      name: "Media Ministry",
      leaders: [
        { name: "Minister Peace Olufemi" },
        { name: "Bro. Precious Olufemi" }
      ],
      icon: Camera,
      color: "bg-muted text-muted-foreground"
    },
    {
      name: "Music Ministry",
      leaders: [
        { name: "Mrs. Temitayo Adeosun" },
        { name: "Bro Praise Olufemi" }
      ],
      icon: Music,
      color: "bg-accent/10 text-accent-foreground"
    },
    {
      name: "Prayer Ministry",
      leaders: [
        { name: "Evang Eunice F. Olufemi" }
      ],
      icon: Heart,
      color: "bg-primary/10 text-primary"
    }
  ];

  const otherRoles = [
    { name: "Secretariat", leaders: [{ name: "Mrs. Kehinde Komolafe" }] },
    { name: "Financial Secretary", leaders: [{ name: "Mrs. Temitayo Adeosun" }] },
    { name: "Treasurer", leaders: [{ name: "Evang. Abiodun Nosiru" }] },
    { name: "Publicity Team", leaders: [{ name: "Dn Sam Sofowora" }] },
    { name: "Pastor's Welfare Committee", leaders: [{ name: "Mrs. Ruth Oluwole" }, { name: "Evang. Abiodun Nosiru" }] },
    { name: "Sanctuary Keepers", leaders: [{ name: "Mrs Aina Sofowora" }] },
    { name: "Decoration Team", leaders: [{ name: "Mrs. Temitayo Adeosun" }] },
    { name: "Drama Ministry", leaders: [{ name: "Mrs. Bola Komolafe" }] },
    { name: "Technical", leaders: [{ name: "Mr. Sunday Oluleye" }] }
  ];

  const churchCentres = [
    { name: "House of Grace, Gbonagun", leaders: [{ name: "Dns. T.A Bankole" }] },
    { name: "Centre of Divine Blessing, Osara", leaders: [{ name: "Dn. Lawrence S. Komolafe" }] },
    { name: "House of Mercy, Asero", leaders: [{ name: "Pastor Tunde & Esther Olufemi" }] }
  ];

  const leaders = [
    {
      name: "Pastor Tunde Olufemi",
      title: "Senior Pastor",
      image: "/images/pastor/Pastor_Tunde_%20Olufemi.jpeg",
      bio: "Pastor Tunde has been leading our church with unwavering faith and dedication for over 15 years.",
      color: "bg-primary/10 text-primary"
    },
    {
      name: "Pastor Mrs. Rachael Olufemi",
      title: "Associate Pastor",
      image: "/images/pastor/Pastor_Tunde_%20Olufemi.jpeg",
      bio: "Pastor Rachael brings a heart of compassion and wisdom to our pastoral team.",
      color: "bg-secondary/10 text-secondary-foreground"
    },
    {
      name: "Deacon Michael Adeyemi",
      title: "Chairman of Deacons",
      image: "/images/leaders/michael-adeyemi.jpg",
      bio: "Deacon Michael serves with integrity and has been a cornerstone of our church leadership.",
      color: "bg-primary/10 text-primary"
    },
    {
      name: "Sister Grace Taiwo",
      title: "Deaconess",
      image: "/images/leaders/grace-taiwo.jpg",
      bio: "Sister Grace is known for her loving care and dedication to the church community.",
      color: "bg-accent/10 text-accent-foreground"
    },
    {
      name: "Brother John Ola",
      title: "Church Secretary",
      image: "/images/leaders/john-ola.jpg",
      bio: "Brother John manages our church administration with excellence and attention to detail.",
      color: "bg-secondary/10 text-secondary-foreground"
    },
    {
      name: "Sister Mary Afolabi",
      title: "Treasurer",
      image: "/images/leaders/mary-afolabi.jpg",
      bio: "Sister Mary ensures financial stewardship and transparency in all church finances.",
      color: "bg-primary/10 text-primary"
    },
    {
      name: "Brother Emmanuel Okafor",
      title: "Youth Leader",
      image: "/images/leaders/emmanuel-okafor.jpg",
      bio: "Brother Emmanuel is passionate about mentoring and guiding our youth in their faith journey.",
      color: "bg-accent/10 text-accent-foreground"
    },
    {
      name: "Sister Blessing Okoro",
      title: "Women's Ministry Leader",
      image: "/images/leaders/blessing-okoro.jpg",
      bio: "Sister Blessing empowers women through faith-based programs and fellowship.",
      color: "bg-secondary/10 text-secondary-foreground"
    }
  ];

  return (
      <div className="min-h-screen bg-background">
        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero Section */}
        <PageHeader
          title="Church Leadership"
          description="Meet the dedicated leaders who guide our church family in worship, service, and spiritual growth."
          backgroundImage="/images/background/leadership_background.jpg"
          minHeight="sm"
          overlay="medium"
          blurBackground={true}
          backgroundPosition="50% 25%"
        />

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 space-y-16">

            {/* Board of Trustees */}
            <div>
              <div className="text-center mb-12">
                <h2 className="mobile-text-2xl font-bold tracking-tight">
                  Board of{" "}
                  <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                    Trustees
                  </span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto" />
                <p className="mx-auto max-w-[700px] text-gray-600 mobile-text-base leading-relaxed mt-4">The governing body providing oversight and direction</p>
              </div>
              <Card className="border-2 border-secondary/30">
                <CardHeader>
                  <CardTitle className="mobile-text-xl text-primary flex items-center justify-center">
                    <Crown className="h-6 w-6 mr-3" />
                    Leadership Council
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {boardOfTrustees.map((leader, index) => (
                        <LeaderCard key={index} leader={leader} showPosition={true} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Spiritual Leadership */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Pastors */}
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="mobile-text-lg text-primary flex items-center">
                    <Crown className="h-5 w-5 mr-2" />
                    Pastors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pastors.map((leader, index) => (
                        <LeaderCard key={index} leader={leader} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Evangelists */}
              <Card className="border-2 border-green-200">
                <CardHeader>
                  <CardTitle className="mobile-text-lg text-green-900 flex items-center">
                    <Megaphone className="h-5 w-5 mr-2" />
                    Evangelists
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {evangelists.map((leader, index) => (
                        <LeaderCard key={index} leader={leader} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Ministers */}
              <Card className="border-2 border-orange-200">
                <CardHeader>
                  <CardTitle className="mobile-text-lg text-orange-900 flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Ministers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ministers.map((leader, index) => (
                        <LeaderCard key={index} leader={leader} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Deaconate */}
              <Card className="border-2 border-secondary/20">
                <CardHeader>
                  <CardTitle className="mobile-text-lg text-secondary-foreground flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Deaconate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deaconate.map((leader, index) => (
                        <LeaderCard key={index} leader={leader} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ministry Leaders */}
            <div>
              <div className="text-center mb-12">
                <h2 className="mobile-text-2xl font-bold tracking-tight">
                  Ministry{" "}
                  <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                    Leaders
                  </span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto" />
                <p className="mx-auto max-w-[700px] text-gray-600 mobile-text-base leading-relaxed mt-4">Dedicated servants leading various ministries and departments</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ministries.map((ministry, index) => (
                    <Card key={index} className="border-2 border-gray-200 hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="mobile-text-lg flex items-center">
                          <ministry.icon className="h-5 w-5 mr-2" />
                          {ministry.name}
                          <Badge className={`ml-auto ${ministry.color}`}>
                            {ministry.leaders.length}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {ministry.leaders.map((leader, leaderIndex) => (
                              <LeaderCard key={leaderIndex} leader={leader} showPosition={true} />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
            </div>

            {/* Other Administrative Roles */}
            <div>
              <div className="text-center mb-12">
                <h2 className="mobile-text-2xl font-bold tracking-tight">
                  Administrative{" "}
                  <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                    Team
                  </span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto" />
                <p className="mx-auto max-w-[700px] text-gray-600 mobile-text-base leading-relaxed mt-4">Supporting the church operations and special functions</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherRoles.map((role, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardHeader>
                        <CardTitle className="mobile-text-base text-gray-900">{role.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {role.leaders.map((leader, leaderIndex) => {
                            const imagePath = getLeaderImagePath(leader.name);
                            const fallbackImage = getFallbackImage(leader.name);

                            return (
                                <div key={leaderIndex} className="text-center">
                                  <div className="relative w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-gray-200">
                                    {imagePath ? (
                                        <Image
                                            src={imagePath}
                                            alt={leader.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : fallbackImage ? (
                                        <Image
                                            src={fallbackImage}
                                            alt={leader.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                          <Users className="h-6 w-6 text-gray-600" />
                                        </div>
                                    )}
                                  </div>
                                  <p className="font-medium mobile-text-sm text-gray-900">{leader.name}</p>
                                </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
            </div>

            {/* Church Centres */}
            <div>
              <div className="text-center mb-12">
                <h2 className="mobile-text-2xl font-bold tracking-tight">
                  Church Centre{" "}
                  <span className="bg-gradient-to-r from-church-primary via-church-accent to-church-primary bg-clip-text text-transparent">
                    Leaders
                  </span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-church-primary via-church-accent to-church-primary rounded-full mx-auto" />
                <p className="mx-auto max-w-[700px] text-gray-600 mobile-text-base leading-relaxed mt-4">Leaders of our various church locations</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {churchCentres.map((centre, index) => (
                    <Card key={index} className="border-2 border-green-200">
                      <CardHeader>
                        <CardTitle className="mobile-text-lg text-green-900 flex items-center">
                          <MapPin className="h-5 w-5 mr-2" />
                          {centre.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {centre.leaders.map((leader, leaderIndex) => (
                              <LeaderCard key={leaderIndex} leader={leader} />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
            </div>

          </div>
        </section>
      </div>
  );
}
