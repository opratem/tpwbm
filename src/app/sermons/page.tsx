"use client";

 import { Badge } from "@/components/ui/badge";
 import { Button } from "@/components/ui/button";
 import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
 } from "@/components/ui/card";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
 import { SermonModal } from "@/components/ui/sermon-modal";
 import { AnimatedSection, StaggeredContainer } from "@/components/ui/animated-section";
 import { Breadcrumbs } from "@/components/shared/breadcrumbs";
 import { PageHeader } from "@/components/ui/page-header";

 import { EnhancedMediaPlayer } from "@/components/ui/enhanced-media-player";
 import { images } from "@/lib/images";
 import { sortSermons, groupSermonsBySeries, extractPartNumber, extractSeriesName } from "@/lib/sermon-sorting";
 import {
   BookOpen,
   Bookmark,
   BookmarkCheck,
   Calendar,
   Clock,
   Copy,
   Eye,
   Facebook,
   Filter,
   Headphones,
   Link,
   Loader2,
   MessageCircle,
   Pause,
   Play,
   PlayCircle,
   Search,
   Share2,
   Star,
   TrendingUp,
   Twitter,
   User,
   Video,
   Volume2,
 } from "lucide-react";
 import Image from "next/image";
 import { useState, useEffect } from "react";
 import { useSession } from "next-auth/react";
 import { toast } from "sonner";

 const sermonData = [
   {
     id: "1",
     title: "Walking in Faith: Trusting God's Plan",
     speaker: "Pastor Tunde Olufemi",
     date: "2024-05-26",
     duration: "45:32",
     series: "Faith Journey",
     description:
         "Discover how to trust God's plan even when the path seems unclear. This powerful message explores biblical principles for walking in faith during uncertain times.",
     videoUrl:
         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
     audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
     thumbnail: images.interior.sanctuary,
     tags: ["Faith", "Trust", "Guidance"],
     featured: true,
     views: 1250,
     likes: 89,
     notes: [
       "Faith is not the absence of doubt, but trusting God despite our uncertainties",
       "God's plan is often revealed step by step, not all at once",
       "Walking in faith requires daily surrender and trust in God's goodness",
       "Biblical examples show us that great faith often emerges from difficult circumstances",
     ],
     transcript:
         "Welcome everyone to this morning's service. Today we're going to explore what it means to walk in faith and trust God's plan for our lives...",
   },
   {
     id: "2",
     title: "The Power of Prayer in Daily Life",
     speaker: "Pastor Esther Olufemi",
     date: "2024-05-19",
     duration: "38:15",
     series: "Prayer Series",
     description:
         "Learn practical ways to incorporate prayer into your daily routine and experience God's presence in every moment.",
     videoUrl:
         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
     audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
     thumbnail: images.interior.colorfulCeiling,
     tags: ["Prayer", "Daily Life", "Spiritual Growth"],
     featured: false,
     views: 987,
     likes: 76,
     notes: [
       "Prayer is conversation with God, not just asking for things",
       "Start each day with gratitude and surrender",
       "God hears every prayer, even when we can't feel His presence",
       "Prayer changes us more than it changes our circumstances",
     ],
   },
   {
     id: "3",
     title: "Building Strong Relationships",
     speaker: "Pastor Tunde Olufemi",
     date: "2024-05-12",
     duration: "42:18",
     series: "Community Life",
     description:
         "Biblical principles for building and maintaining strong, healthy relationships in our families and communities.",
     videoUrl:
         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
     audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
     thumbnail: images.community.community,
     tags: ["Relationships", "Community", "Love"],
     featured: false,
     views: 743,
     likes: 62,
     notes: [
       "Love is a choice, not just a feeling",
       "Forgiveness is essential for healthy relationships",
       "Communication should be seasoned with grace and truth",
       "Invest in relationships before you need them",
     ],
   },
   {
     id: "4",
     title: "Finding Hope in Difficult Times",
     speaker: "Pastor John Smith",
     date: "2024-05-05",
     duration: "41:45",
     series: "Hope Series",
     description:
         "When life gets tough, where do we find hope? This message explores how God's promises sustain us through challenges.",
     videoUrl:
         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
     audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
     thumbnail: images.interior.stainedGlass,
     tags: ["Hope", "Trials", "God's Promises"],
     featured: false,
     views: 892,
     likes: 71,
     notes: [
       "Hope is an anchor for the soul in stormy seasons",
       "God's promises are our foundation when everything else shakes",
       "Difficult times often reveal God's faithfulness in new ways",
       "Hope is not wishful thinking, but confident expectation in God",
     ],
   },
   {
     id: "5",
     title: "The Heart of Worship",
     speaker: "Pastor Sarah Johnson",
     date: "2024-04-28",
     duration: "36:22",
     series: "Worship Series",
     description:
         "Understanding what true worship means and how to cultivate a heart that honors God in all aspects of life.",
     videoUrl:
         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
     audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
     thumbnail: images.interior.modernSanctuary,
     tags: ["Worship", "Heart", "Honor"],
     featured: false,
     views: 654,
     likes: 55,
     notes: [
       "Worship is a lifestyle, not just a Sunday activity",
       "True worship comes from a heart of gratitude and reverence",
       "We can worship God through our work, relationships, and service",
       "Worship transforms our perspective on life's challenges",
     ],
   },
   {
     id: "6",
     title: "Grace That Transforms",
     speaker: "Pastor Michael Davis",
     date: "2024-04-21",
     duration: "44:10",
     series: "Grace Series",
     description:
         "Exploring the transformative power of God's grace and how it changes our lives from the inside out.",
     videoUrl:
         "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
     audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
     thumbnail: images.exterior.white_chapel,
     tags: ["Grace", "Transformation", "Change"],
     featured: false,
     views: 789,
     likes: 67,
     notes: [
       "Grace is God's unmerited favor toward us",
       "Transformation happens from the inside out through God's grace",
       "We extend grace to others because we've received it from God",
       "Grace doesn't excuse sin, but empowers us to overcome it",
     ],
   },
 ];

 const seriesList = [
   "All Series",
   "Faith Journey",
   "Prayer Series",
   "Community Life",
   "Hope Series",
   "Worship Series",
   "Grace Series",
 ];

 export default function SermonsPage() {
   const { data: session } = useSession();
   const [selectedSeries, setSelectedSeries] = useState("All Series");
   const [searchTerm, setSearchTerm] = useState("");
   const [playingAudio, setPlayingAudio] = useState<string | null>(null);
   const [selectedSermon, setSelectedSermon] = useState<
       (typeof sermonData)[0] | null
   >(null);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [sortBy, setSortBy] = useState<"newest" | "popular" | "featured" | "series">(
       "newest",
   );
   const [youtubeSermons, setYoutubeSermons] = useState<any[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [bookmarkedSermons, setBookmarkedSermons] = useState<Record<string, boolean>>({});

   useEffect(() => {
     const loadSermons = async () => {
       setIsLoading(true);
       try {
         // Load from YouTube church channel only
         const youtubeResponse = await fetch('/api/youtube/church-content?type=sermons&maxResults=20').catch(() => null);

         // Load YouTube sermons
         if (youtubeResponse && youtubeResponse.ok) {
           const youtubeData = await youtubeResponse.json();
           if (youtubeData.success && youtubeData.sermons) {
             setYoutubeSermons(youtubeData.sermons);
             console.log(`Loaded ${youtubeData.sermons.length} sermons from YouTube church channel`);
           }
         }

       } catch (error) {
         console.error('Error loading sermons:', error);
         setYoutubeSermons([]);
       } finally {
         setIsLoading(false);
       }
     };

     loadSermons();
   }, []);

   // Use YouTube sermons or fallback to placeholder data
   const allSermons = youtubeSermons.length > 0 ?
       youtubeSermons.map((sermon, index) => ({
         id: `youtube-${sermon.id}`,
         title: sermon.title,
         speaker: sermon.speaker,
         date: sermon.date,
         duration: sermon.duration,
         series: sermon.series || 'Church Messages',
         description: sermon.description,
         videoUrl: sermon.youtubeUrl,
         audioUrl: sermon.youtubeUrl, // Same as video for YouTube content
         thumbnail: sermon.thumbnail,
         tags: sermon.tags || ['message', 'teaching'],
         featured: index === 0, // First YouTube sermon is featured
         views: Number.parseInt(sermon.rawViewCount || '0'),
         likes: Number.parseInt(sermon.likeCount || '0'),
         notes: sermon.notes,
         transcript: "Watch this powerful message on YouTube...",
         isYouTube: true,
         embedUrl: sermon.embedUrl
       })) : sermonData;

   const filteredSermons = (() => {
     const filtered = allSermons.filter((sermon) => {
       const matchesSeries =
           selectedSeries === "All Series" || sermon.series === selectedSeries;
       const matchesSearch =
           sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
           sermon.description.toLowerCase().includes(searchTerm.toLowerCase());
       return matchesSeries && matchesSearch;
     });

     // Use the enhanced sorting logic
     switch (sortBy) {
       case "series":
         return sortSermons(filtered, "series");
       case "popular":
         return filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
       case "featured":
         return filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
       default:
         return sortSermons(filtered, "newest");
     }
   })();

   const featuredSermon = allSermons.find((sermon) => sermon.featured);

   const handleAudioPlay = (sermonId: string) => {
     setPlayingAudio(playingAudio === sermonId ? null : sermonId);
   };

   const openSermonModal = (sermon: (typeof sermonData)[0]) => {
     setSelectedSermon(sermon);
     setIsModalOpen(true);
   };

   const closeSermonModal = () => {
     setIsModalOpen(false);
     setSelectedSermon(null);
   };

   const handleSocialShare = (platform: string, sermon: any) => {
     const sermonUrl = `${window.location.origin}/sermons`;
     const sermonTitle = `Check out this inspiring sermon: "${sermon.title}" by ${sermon.speaker}`;
     const description = sermon.description.substring(0, 100) + "...";

     let shareUrl = "";

     switch (platform) {
       case "facebook":
         shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sermonUrl)}&quote=${encodeURIComponent(sermonTitle)}`;
         break;
       case "twitter":
         shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(sermonTitle)}&url=${encodeURIComponent(sermonUrl)}`;
         break;
       case "whatsapp":
         shareUrl = `https://wa.me/?text=${encodeURIComponent(`${sermonTitle} ${sermonUrl}`)}`;
         break;
       case "copy":
         navigator.clipboard.writeText(`${sermonTitle} ${sermonUrl}`);
         toast("Link copied to clipboard!");
         return;
       default:
         return;
     }

     if (shareUrl) {
       window.open(shareUrl, '_blank', 'width=600,height=400');
     }
   };

   // Check bookmarks for all sermons
   useEffect(() => {
     if (session?.user && allSermons.length > 0) {
       const sermonIds = allSermons.map(s => s.id).join(',');
       fetch(`/api/bookmarks/check?resourceIds=${sermonIds}`)
         .then(res => res.json())
         .then(data => {
           if (data.success) {
             setBookmarkedSermons(data.bookmarked);
           }
         })
         .catch(error => console.error('Error checking bookmarks:', error));
     }
   }, [session, allSermons.length]);

   // Toggle bookmark
   const handleBookmark = async (sermon: any) => {
     if (!session?.user) {
       toast("Please login to save sermons");
       return;
     }

     const isBookmarked = bookmarkedSermons[sermon.id];

     if (isBookmarked) {
       // Remove bookmark
       try {
         const response = await fetch(
           `/api/bookmarks?resourceId=${sermon.id}&resourceType=sermon`,
           { method: 'DELETE' }
         );

         if (response.ok) {
           setBookmarkedSermons(prev => ({ ...prev, [sermon.id]: false }));
           toast("Sermon removed from saved");
         } else {
           toast("Failed to remove bookmark");
         }
       } catch (error) {
         console.error('Error removing bookmark:', error);
         toast("Failed to remove bookmark");
       }
     } else {
       // Add bookmark
       try {
         const response = await fetch('/api/bookmarks', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             resourceType: 'sermon',
             resourceId: sermon.id,
             resourceTitle: sermon.title,
             resourceUrl: sermon.videoUrl,
             resourceThumbnail: sermon.thumbnail,
             resourceMetadata: {
               speaker: sermon.speaker,
               date: sermon.date,
               duration: sermon.duration,
               description: sermon.description,
               tags: sermon.tags,
               series: sermon.series
             }
           })
         });

         const data = await response.json();

         if (response.ok || response.status === 409) {
           setBookmarkedSermons(prev => ({ ...prev, [sermon.id]: true }));
           toast("Sermon saved successfully");
         } else {
           toast(data.error || "Failed to save sermon");
         }
       } catch (error) {
         console.error('Error saving bookmark:', error);
         toast("Failed to save sermon");
       }
     }
   };

   if (isLoading) {
     return (
         <div className="flex flex-col min-h-screen">
           <section
               className="w-full py-6 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-slate-900"
           >
             {/* Blurred background image */}
             <div
                 className="absolute inset-0 bg-cover bg-center"
                 style={{
                   backgroundImage: `url(/images/background/Semon_Background.jpg)`,
                   backgroundPosition: "50% 10%",
                   backgroundSize: "cover",
                   backgroundRepeat: "no-repeat",
                   backgroundAttachment: "fixed",
                   filter: "blur(4px)",
                   transform: "scale(1.1)"
                 }}
             />

             {/* Minimal overlay for better background visibility */}
             <div className="absolute inset-0 bg-black/40" />

             {/* Floating Particles Effect */}
             <div className="absolute inset-0 overflow-hidden">
               <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
               <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
               <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-white/15 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
               <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
               <div className="absolute bottom-1/3 right-2/3 w-1 h-1 bg-white/25 rounded-full animate-ping" style={{ animationDelay: '4s' }} />
             </div>

             <div className="container px-4 md:px-6 relative z-10">
               <div className="flex flex-col items-center justify-center space-y-6 text-center text-white">
                 <AnimatedSection className="space-y-4" animation="fadeUp" delay={200}>
                   <h1 className="mobile-text-3xl font-bold tracking-tight leading-tight max-w-4xl text-white drop-shadow-2xl">
                     Sermons & Media Archive
                   </h1>
                   <p className="mx-auto max-w-[700px] text-lg md:text-xl text-white/95 font-medium leading-relaxed drop-shadow-lg">
                     Watch, listen, and grow with our collection of inspiring
                     messages and teachings from multiple platforms.
                   </p>
                 </AnimatedSection>
                 <StaggeredContainer className="flex flex-col sm:flex-row gap-4" delay={400}>
                   <Button
                       size="lg"
                       className="h-14 px-8 rounded-full bg-[hsl(218_31%_18%)] hover:bg-[hsl(218_28%_25%)] text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/10"
                       onClick={() => window.open('https://www.youtube.com/playlist?list=PLwBPssCuCmunwMU9LCjeIfSCmpNtuV5mW', '_blank')}
                   >
                     <PlayCircle className="h-5 w-5 mr-3 stroke-white" />
                     <div className="text-left">
                       <div className="font-bold text-sm text-white">Watch Latest</div>
                       <div className="text-xs text-white/90">YouTube Sermons</div>
                     </div>
                   </Button>
                   <Button
                       size="lg"
                       className="h-14 px-8 rounded-full bg-[hsl(45_56%_55%)] hover:bg-[hsl(45_56%_48%)] text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-white/10"
                       onClick={() => window.open('https://www.youtube.com/playlist?list=PLwBPssCuCmumudb67faguWlaKGHB_YOg-', '_blank')}
                   >
                     <Headphones className="h-5 w-5 mr-3 stroke-white" />
                     <div className="text-left">
                       <div className="font-bold text-sm text-white">Listen Audio</div>
                       <div className="text-xs text-white/90">Radio Messages</div>
                     </div>
                   </Button>
                 </StaggeredContainer>
                 <div className="flex items-center space-x-3 mt-8">
                   <Loader2 className="h-8 w-8 animate-spin text-white/80" />
                   <p className="text-xl text-white/90">Loading sermons from YouTube...</p>
                 </div>
               </div>
             </div>
           </section>
         </div>
     );
   }

   return (
       <div className="flex flex-col min-h-screen">
         <Breadcrumbs />

         <PageHeader
           title="Sermons & Media Archive"
           description="Watch, listen, and grow with our collection of inspiring messages and teachings from multiple platforms."
           backgroundImage="/images/background/Semon_Background.jpg"
           minHeight="sm"
           overlay="medium"
           blurBackground={true}
           backgroundPosition="50% 10%"
         />

         <section className="w-full py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
           <div className="container px-4 md:px-6">
             <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
               <h2 className="mobile-text-2xl font-bold tracking-tight text-[hsl(218_31%_18%)]">
                 Sermon{" "}
                 <span className="bg-gradient-to-r from-[hsl(218_31%_18%)] via-[hsl(45_56%_55%)] to-[hsl(218_31%_18%)] bg-clip-text text-transparent">
                   Archive
                 </span>
               </h2>
               <div className="w-24 h-1 bg-gradient-to-r from-[hsl(218_31%_18%)] via-[hsl(45_56%_55%)] to-[hsl(218_31%_18%)] rounded-full mx-auto" />
             </div>

             <div className="flex flex-col lg:flex-row gap-4 mb-8 max-w-6xl mx-auto">
               <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                 <input
                     type="text"
                     placeholder="Search sermons by title, speaker, or content..."
                     className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:border-transparent"
                     style={{ '--tw-ring-color': 'hsl(45, 56%, 55%)' } as React.CSSProperties}
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
               <div className="relative">
                 <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                 <select
                     className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:border-transparent appearance-none min-w-[160px]"
                     style={{ '--tw-ring-color': 'hsl(45, 56%, 55%)' } as React.CSSProperties}
                     value={selectedSeries}
                     onChange={(e) => setSelectedSeries(e.target.value)}
                 >
                   {seriesList.map((series) => (
                       <option key={series} value={series}>
                         {series}
                       </option>
                   ))}
                 </select>
               </div>
               <div className="relative">
                 <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                 <select
                     className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:border-transparent appearance-none min-w-[140px]"
                     style={{ '--tw-ring-color': 'hsl(45, 56%, 55%)' } as React.CSSProperties}
                     value={sortBy}
                     onChange={(e) =>
                         setSortBy(e.target.value as "newest" | "popular" | "featured" | "series")
                     }
                 >
                   <option value="newest">Newest</option>
                   <option value="popular">Most Popular</option>
                   <option value="featured">Featured</option>
                   <option value="series">By Series</option>
                 </select>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredSermons.map((sermon) => (
                   <Card
                       key={sermon.id}
                       className="group overflow-hidden flex flex-col h-full shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md"
                   >
                     <div className="h-48 overflow-hidden relative">
                       <Image
                           src={sermon.thumbnail}
                           alt={sermon.title}
                           fill
                           style={{ objectFit: "cover" }}
                           className="group-hover:scale-110 transition-transform duration-700"
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                       <div className="absolute top-4 left-4">
                         {sermon.featured ? (
                             <Badge
                                 variant="secondary"
                                 style={{ backgroundColor: 'hsl(45, 56%, 55%)', color: 'white' }}
                             >
                               <Star className="h-3 w-3 mr-1" />
                               Featured
                             </Badge>
                         ) : (
                             <Badge
                                 variant="secondary"
                                 style={{ backgroundColor: 'hsl(218, 31%, 18%)', color: 'white' }}
                             >
                               {sermon.series}
                             </Badge>
                         )}
                       </div>
                       <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-xs">
                         <Clock className="h-3 w-3 inline mr-1" />
                         {sermon.duration}
                       </div>
                       <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white text-xs">
                         <div className="flex items-center bg-black/50 px-2 py-1 rounded">
                           <Eye className="h-3 w-3 mr-1" />
                           {sermon.views}
                         </div>
                         <div className="flex items-center bg-black/50 px-2 py-1 rounded">
                           <Star className="h-3 w-3 mr-1" />
                           {sermon.likes}
                         </div>
                       </div>
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         <Button
                             size="sm"
                             onClick={() => openSermonModal(sermon)}
                             className="bg-white/90 text-gray-900 hover:bg-white rounded-full p-3 shadow-xl"
                         >
                           <Play className="h-5 w-5" />
                         </Button>
                       </div>
                     </div>
                     <CardHeader className="pb-3">
                       <CardTitle className="text-lg font-bold line-clamp-2">
                         {sermon.title}
                       </CardTitle>
                       <CardDescription className="flex items-center space-x-4 text-sm">
                     <span className="flex items-center">
                       <User className="h-3 w-3 mr-1" />
                       {sermon.speaker}
                     </span>
                         <span className="flex items-center">
                       <Calendar className="h-3 w-3 mr-1" />
                           {new Date(sermon.date).toLocaleDateString()}
                     </span>
                       </CardDescription>
                     </CardHeader>
                     <CardContent className="flex-grow pb-3">
                       <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                         {sermon.description}
                       </p>
                       <div className="flex flex-wrap gap-1 mt-3">
                         {sermon.tags.slice(0, 2).map((tag: string) => (
                             <Badge key={tag} variant="outline" className="text-xs">
                               {tag}
                             </Badge>
                         ))}
                       </div>
                     </CardContent>
                     <CardFooter className="pt-0 space-y-2">
                       <div className="flex gap-2 w-full">
                         <Button
                             size="sm"
                             className="rounded-full flex-1"
                             style={{ backgroundColor: 'hsl(218, 31%, 18%)', color: 'white' }}
                             onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'hsl(218, 35%, 12%)'}
                             onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'hsl(218, 31%, 18%)'}
                             onClick={() => openSermonModal(sermon)}
                         >
                           <Video className="h-3 w-3 mr-1" />
                           Watch
                         </Button>
                         <Button
                             size="sm"
                             variant="outline"
                             className="rounded-full flex-1"
                             onClick={() => handleAudioPlay(sermon.id)}
                         >
                           {playingAudio === sermon.id ? (
                               <Pause className="h-3 w-3 mr-1" />
                           ) : (
                               <Play className="h-3 w-3 mr-1" />
                           )}
                           {playingAudio === sermon.id ? "Pause" : "Listen"}
                         </Button>
                       </div>
                       <div className="flex justify-center gap-2 w-full">
                         <Button
                           variant="ghost"
                           size="sm"
                           className={`text-xs px-3 transition-colors duration-200 ${
                             bookmarkedSermons[sermon.id]
                               ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                               : 'hover:bg-amber-50 hover:text-amber-600'
                           }`}
                           onClick={() => handleBookmark(sermon)}
                         >
                           {bookmarkedSermons[sermon.id] ? (
                             <BookmarkCheck className="h-3 w-3 mr-1 fill-current" />
                           ) : (
                             <Bookmark className="h-3 w-3 mr-1" />
                           )}
                           {bookmarkedSermons[sermon.id] ? 'Saved' : 'Save'}
                         </Button>
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="sm" className="text-xs px-3 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
                               <Share2 className="h-3 w-3 mr-1" />
                               Share
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="w-48">
                             <DropdownMenuItem
                                 onClick={() => handleSocialShare("facebook", sermon)}
                                 className="flex items-center gap-2 cursor-pointer hover:bg-blue-50"
                             >
                               <Facebook className="h-4 w-4 text-blue-600" />
                               Share on Facebook
                             </DropdownMenuItem>
                             <DropdownMenuItem
                                 onClick={() => handleSocialShare("twitter", sermon)}
                                 className="flex items-center gap-2 cursor-pointer hover:bg-sky-50"
                             >
                               <Twitter className="h-4 w-4 text-sky-500" />
                               Share on Twitter
                             </DropdownMenuItem>
                             <DropdownMenuItem
                                 onClick={() => handleSocialShare("whatsapp", sermon)}
                                 className="flex items-center gap-2 cursor-pointer hover:bg-green-50"
                             >
                               <MessageCircle className="h-4 w-4 text-green-600" />
                               Share on WhatsApp
                             </DropdownMenuItem>
                             <DropdownMenuItem
                                 onClick={() => handleSocialShare("copy", sermon)}
                                 className="flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                             >
                               <Copy className="h-4 w-4 text-gray-600" />
                               Copy Link
                             </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                       </div>
                     </CardFooter>
                   </Card>
               ))}
             </div>

             {filteredSermons.length === 0 && (
                 <div className="text-center py-12">
                   <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                   <h3 className="mobile-text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                     No sermons found
                   </h3>
                   <p className="text-gray-500 dark:text-gray-400">
                     Try adjusting your search or filter criteria
                   </p>
                 </div>
             )}
           </div>
         </section>

         {/* Content Navigation Section - Inspired by Live Streaming Message Archives */}
         <section className="w-full py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white dark:from-blue-900 dark:to-purple-900">
           <div className="container px-4 md:px-6">
             <div className="text-center mb-12">
               <h2 className="mobile-text-2xl font-bold tracking-tight mb-4 text-[hsl(218_31%_18%)]">
                 Explore More{" "}
                 <span className="bg-gradient-to-r from-[hsl(218_31%_18%)] via-[hsl(45_56%_55%)] to-[hsl(218_31%_18%)] bg-clip-text text-transparent">
                   Content
                 </span>
               </h2>
               <div className="w-24 h-1 bg-gradient-to-r from-[hsl(218_31%_18%)] via-[hsl(45_56%_55%)] to-[hsl(218_31%_18%)] rounded-full mx-auto mb-4" />
               <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                 Access our complete collection of spiritual content across all platforms
               </p>
             </div>

             <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
               {/* Live Streaming Link */}
               <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-200/30 dark:border-red-800/30 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-red-900/90 dark:to-red-800/90 backdrop-blur-lg">
                 <CardContent className="p-8 text-center">
                   <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-shadow" style={{ backgroundColor: 'hsl(218, 31%, 18%)' }}>
                     <PlayCircle className="h-8 w-8 text-white" />
                   </div>
                   <h3 className="mobile-text-lg font-bold mb-3" style={{ color: 'hsl(218, 31%, 18%)' }}>Live Streaming</h3>
                   <p className="mb-6" style={{ color: 'hsl(218, 15%, 40%)' }}>
                     Join us for live worship services and connect with our community
                   </p>
                   <Button
                     asChild
                     className="w-full text-white shadow-lg hover:shadow-xl transition-all duration-300"
                     style={{ backgroundColor: 'hsl(218, 31%, 18%)' }}
                     onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'hsl(218, 35%, 12%)'}
                     onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'hsl(218, 31%, 18%)'}
                   >
                     <Link href="/live-streaming">
                       Watch Live
                     </Link>
                   </Button>
                 </CardContent>
               </Card>

               {/* Audio Messages Link */}
               <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-200/30 dark:border-purple-800/30 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-purple-900/90 dark:to-purple-800/90 backdrop-blur-lg">
                 <CardContent className="p-8 text-center">
                   <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-shadow" style={{ backgroundColor: 'hsl(45, 56%, 55%)' }}>
                     <Volume2 className="h-8 w-8 text-white" />
                   </div>
                   <h3 className="mobile-text-lg font-bold mb-3" style={{ color: 'hsl(218, 31%, 18%)' }}>Audio Messages</h3>
                   <p className="mb-6" style={{ color: 'hsl(218, 15%, 40%)' }}>
                     Listen to inspiring radio broadcasts and audio sermons
                   </p>
                   <Button
                     asChild
                     className="w-full text-white shadow-lg hover:shadow-xl transition-all duration-300"
                     style={{ backgroundColor: 'hsl(45, 56%, 55%)' }}
                     onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'hsl(45, 56%, 48%)'}
                     onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'hsl(45, 56%, 55%)'}
                   >
                     <Link href="/audio-messages">
                       Listen Now
                     </Link>
                   </Button>
                 </CardContent>
               </Card>

               {/* YouTube Channel Link */}
               <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-200/30 dark:border-indigo-800/30 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-indigo-900/90 dark:to-indigo-800/90 backdrop-blur-lg">
                 <CardContent className="p-8 text-center">
                   <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-shadow" style={{ backgroundColor: 'hsl(218, 31%, 18%)' }}>
                     <Video className="h-8 w-8 text-white" />
                   </div>
                   <h3 className="mobile-text-lg font-bold mb-3" style={{ color: 'hsl(218, 31%, 18%)' }}>YouTube Channel</h3>
                   <p className="mb-6" style={{ color: 'hsl(218, 15%, 40%)' }}>
                     Subscribe to our channel for the latest video content
                   </p>
                   <Button
                     asChild
                     className="w-full text-white shadow-lg hover:shadow-xl transition-all duration-300"
                     style={{ backgroundColor: 'hsl(218, 31%, 18%)' }}
                     onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'hsl(218, 35%, 12%)'}
                     onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'hsl(218, 31%, 18%)'}
                   >
                     <a href="https://www.youtube.com/@tundeolufemi5339" target="_blank" rel="noopener noreferrer">
                       Subscribe Now
                     </a>
                   </Button>
                 </CardContent>
               </Card>
             </div>
           </div>
         </section>

         <section className="w-full py-16 md:py-24 relative overflow-hidden">
           {/* Background Image with Blur */}
           <div
             className="absolute inset-0 bg-cover bg-center"
             style={{
               backgroundImage: "url('https://resi.io/wp-content/uploads/2023/08/BLOG-streaming-y-1568x1045.jpg')",
               backgroundPosition: 'center',
               filter: 'blur(8px)',
               transform: 'scale(1.1)'
             }}
           />

           {/* Enhanced overlay for depth and readability - Updated to navy blue theme */}
           <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/70" />
           <div className="absolute inset-0 bg-gradient-to-b from-[hsl(218,31%,18%)]/50 via-[hsl(218,31%,18%)]/30 to-[hsl(218,35%,12%)]/50" />

           {/* Floating Particles Effect for Glassmorphism - Updated to church colors */}
           <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute top-1/5 left-1/3 w-2 h-2 bg-[hsl(45,56%,55%)]/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
             <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
             <div className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-[hsl(218,31%,18%)]/20 rounded-full animate-ping" style={{ animationDelay: '2.5s' }} />
             <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-[hsl(45,56%,55%)]/20 rounded-full animate-pulse" style={{ animationDelay: '3.5s' }} />
             <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '4.5s' }} />
           </div>

           <div className="container px-4 md:px-6 relative z-10">
             <div className="flex flex-col items-center justify-center space-y-6 text-center">
               <div className="space-y-4">
                 <h2 className="mobile-text-2xl font-bold tracking-tight text-white">
                   More{" "}
                   <span className="text-white">
                     Pastor's Sermons
                   </span>
                 </h2>
                 <div className="w-24 h-1 bg-gradient-to-r from-[hsl(45,56%,55%)] to-[hsl(45,56%,55%)] rounded-full mx-auto" />
                 <p className="mx-auto max-w-[700px] text-white text-lg md:text-xl leading-relaxed">
                   Subscribe to our YouTube channel to watch more inspiring messages and teachings from Pastor 'Tunde Olufemi' and our ministry team.
                 </p>
               </div>
               <Button
                   size="lg"
                   onClick={() => window.open('https://www.youtube.com/@PrevailingWord-d7h4o', '_blank')}
                   className="text-white text-lg font-semibold px-8 py-4 rounded-full transform hover:scale-105 transition-all duration-200 shadow-xl"
                   style={{ backgroundColor: 'hsl(218, 31%, 18%)' }}
                   onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'hsl(218, 35%, 12%)'}
                   onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.backgroundColor = 'hsl(218, 31%, 18%)'}
               >
                 <Video className="h-5 w-5 mr-2" />
                 Visit Our YouTube Channel
               </Button>
             </div>
           </div>
         </section>

         <SermonModal
             sermon={selectedSermon}
             isOpen={isModalOpen}
             onClose={closeSermonModal}
         />
       </div>
   );
 }
