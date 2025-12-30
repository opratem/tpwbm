"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Folder,
  Image as ImageIcon,
  ArrowLeft,
  Loader2,
  Download
} from "lucide-react";
import {
  getCloudinaryImageUrl,
  type CloudinaryGalleryImage,
  churchImages
} from "@/lib/cloudinary-client";

interface GalleryImage {
  id: number | string;
  src: string;
  alt: string;
  category: string;
  title: string;
  date: string;
  thumbnailSrc?: string;
}

// Gallery folder configuration - matches your Cloudinary structure
// Excluding 'leaders' and 'pastor' folders as they are for leadership page profile pictures
const GALLERY_FOLDERS = [
  {
    key: 'convention',
    name: 'Convention',
    icon: Folder,
    color: 'bg-[hsl(218,31%,18%)] text-white hover:bg-[hsl(218,31%,15%)]',
    bgColor: 'bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600',
    borderColor: 'border-[hsl(218,31%,18%)]/20 hover:border-[hsl(218,31%,18%)]/40',
    accentColor: 'bg-[hsl(45,56%,55%)]'
  },
  {
    key: 'Bible Study',
    name: 'Bible Study',
    icon: Folder,
    color: 'bg-[hsl(218,31%,18%)] text-white hover:bg-[hsl(218,31%,15%)]',
    bgColor: 'bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600',
    borderColor: 'border-[hsl(218,31%,18%)]/20 hover:border-[hsl(218,31%,18%)]/40',
    accentColor: 'bg-[hsl(45,56%,55%)]'
  },
  {
    key: 'Sunday Service',
    name: 'Sunday Service',
    icon: Folder,
    color: 'bg-[hsl(218,31%,18%)] text-white hover:bg-[hsl(218,31%,15%)]',
    bgColor: 'bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600',
    borderColor: 'border-[hsl(218,31%,18%)]/20 hover:border-[hsl(218,31%,18%)]/40',
    accentColor: 'bg-[hsl(45,56%,55%)]'
  },
  {
    key: 'children',
    name: 'Children Ministry',
    icon: Folder,
    color: 'bg-[hsl(218,31%,18%)] text-white hover:bg-[hsl(218,31%,15%)]',
    bgColor: 'bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600',
    borderColor: 'border-[hsl(218,31%,18%)]/20 hover:border-[hsl(218,31%,18%)]/40',
    accentColor: 'bg-[hsl(45,56%,55%)]'
  },
  {
    key: 'men',
    name: 'Men Ministry',
    icon: Folder,
    color: 'bg-[hsl(218,31%,18%)] text-white hover:bg-[hsl(218,31%,15%)]',
    bgColor: 'bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600',
    borderColor: 'border-[hsl(218,31%,18%)]/20 hover:border-[hsl(218,31%,18%)]/40',
    accentColor: 'bg-[hsl(45,56%,55%)]'
  },
  {
    key: 'women',
    name: 'Women Ministry',
    icon: Folder,
    color: 'bg-[hsl(218,31%,18%)] text-white hover:bg-[hsl(218,31%,15%)]',
    bgColor: 'bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600',
    borderColor: 'border-[hsl(218,31%,18%)]/20 hover:border-[hsl(218,31%,18%)]/40',
    accentColor: 'bg-[hsl(45,56%,55%)]'
  },
  {
    key: 'music',
    name: 'Music Ministry',
    icon: Folder,
    color: 'bg-[hsl(218,31%,18%)] text-white hover:bg-[hsl(218,31%,15%)]',
    bgColor: 'bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600',
    borderColor: 'border-[hsl(218,31%,18%)]/20 hover:border-[hsl(218,31%,18%)]/40',
    accentColor: 'bg-[hsl(45,56%,55%)]'
  },
  {
    key: 'youth',
    name: 'Youth Ministry',
    icon: Folder,
    color: 'bg-[hsl(218,31%,18%)] text-white hover:bg-[hsl(218,31%,15%)]',
    bgColor: 'bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600',
    borderColor: 'border-[hsl(218,31%,18%)]/20 hover:border-[hsl(218,31%,18%)]/40',
    accentColor: 'bg-[hsl(45,56%,55%)]'
  }
];

export default function GalleryPage() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [organizedImages, setOrganizedImages] = useState<{ [key: string]: GalleryImage[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [totalImages, setTotalImages] = useState(0);

  // Local gallery images (existing church photos and youth ministry photos)
  const localGalleryImages: GalleryImage[] = useMemo(() => [
    // Existing church photos from Cloudinary
    {
      id: 1,
      src: getCloudinaryImageUrl(churchImages.gallery.church1, { width: 800, height: 600 }),
      alt: "Church Interior",
      category: "worship",
      title: "Church Interior",
      date: "2024"
    },
    {
      id: 2,
      src: getCloudinaryImageUrl(churchImages.gallery.church2, { width: 800, height: 600 }),
      alt: "Convention 2024",
      category: "convention",
      title: "Church Sanctuary",
      date: "2024"
    },
    {
      id: 3,
      src: getCloudinaryImageUrl(churchImages.gallery.church3, { width: 800, height: 600 }),
      alt: "Church Worship Area",
      category: "worship",
      title: "Worship Area",
      date: "2024"
    },
    {
      id: 4,
      src: getCloudinaryImageUrl(churchImages.gallery.church4, { width: 800, height: 600 }),
      alt: "Church Assembly",
      category: "convention",
      title: "Church Assembly",
      date: "2024"
    },

    // Local Youth Ministry Photos
    {
      id: 101,
      src: "/images/youth/youth1.jpg",
      alt: "Youth Ministry Fellowship",
      category: "youth",
      title: "Youth Fellowship Gathering",
      date: "2024",
      thumbnailSrc: "/images/youth/youth1.jpg"
    },
    {
      id: 102,
      src: "/images/youth/youth2.jpg",
      alt: "Youth Ministry Activities",
      category: "youth",
      title: "Youth Ministry Activities",
      date: "2024",
      thumbnailSrc: "/images/youth/youth2.jpg"
    },
    {
      id: 103,
      src: "/images/youth/youth3.jpg",
      alt: "Youth Worship Service",
      category: "youth",
      title: "Youth Worship Time",
      date: "2024",
      thumbnailSrc: "/images/youth/youth3.jpg"
    },
    {
      id: 104,
      src: "/images/youth/youth4.jpg",
      alt: "Youth Ministry Gathering",
      category: "youth",
      title: "Youth Ministry Meeting",
      date: "2024",
      thumbnailSrc: "/images/youth/youth4.jpg"
    },
    {
      id: 105,
      src: "/images/youth/youth5.jpg",
      alt: "Youth Bible Study",
      category: "youth",
      title: "Youth Bible Study Session",
      date: "2024",
      thumbnailSrc: "/images/youth/youth5.jpg"
    },
    {
      id: 106,
      src: "/images/youth/youth6.jpg",
      alt: "Youth Ministry Event",
      category: "youth",
      title: "Youth Ministry Special Event",
      date: "2024",
      thumbnailSrc: "/images/youth/youth6.jpg"
    },
    {
      id: 107,
      src: "/images/youth/youth7.jpg",
      alt: "Youth Prayer Meeting",
      category: "youth",
      title: "Youth Prayer Time",
      date: "2024",
      thumbnailSrc: "/images/youth/youth7.jpg"
    },
    {
      id: 108,
      src: "/images/youth/youth8.jpg",
      alt: "Youth Ministry Outreach",
      category: "youth",
      title: "Youth Outreach Program",
      date: "2024",
      thumbnailSrc: "/images/youth/youth8.jpg"
    },

    // Music Ministry Photos
    {
      id: 201,
      src: "/images/music/music_background.jpg",
      alt: "Music Ministry",
      category: "music",
      title: "Music Ministry Background",
      date: "2024",
      thumbnailSrc: "/images/music/music_background.jpg"
    },
    {
      id: 202,
      src: "/images/music/music_cover.jpg",
      alt: "Music Ministry Cover",
      category: "music",
      title: "Music Ministry Cover",
      date: "2024",
      thumbnailSrc: "/images/music/music_cover.jpg"
    }
  ], []);

  // Load organized gallery images from Cloudinary
  useEffect(() => {
    const loadOrganizedGalleryImages = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/cloudinary/gallery-folders');
        const data = await response.json();

        if (data.success && data.organizedImages) {
          console.log('Organized images data:', data);

          // Convert CloudinaryGalleryImage to GalleryImage format
          const formattedOrganizedImages: { [key: string]: GalleryImage[] } = {};

          for (const [folderName, images] of Object.entries(data.organizedImages)) {
            formattedOrganizedImages[folderName] = (images as CloudinaryGalleryImage[]).map((img) => ({
              id: img.id,
              src: img.src,
              alt: img.alt,
              category: folderName,
              title: img.title,
              date: img.date,
              thumbnailSrc: img.thumbnailSrc
            }));
          }

          // Add local images to their respective categories
          localGalleryImages.forEach(localImg => {
            if (!formattedOrganizedImages[localImg.category]) {
              formattedOrganizedImages[localImg.category] = [];
            }
            formattedOrganizedImages[localImg.category].push(localImg);
          });

          setOrganizedImages(formattedOrganizedImages);
          setTotalImages(data.totalImages + localGalleryImages.length);
        } else {
          console.error('Failed to load organized images:', data);
          // Fallback to local images only
          const fallbackOrganized: { [key: string]: GalleryImage[] } = {};
          localGalleryImages.forEach(img => {
            if (!fallbackOrganized[img.category]) {
              fallbackOrganized[img.category] = [];
            }
            fallbackOrganized[img.category].push(img);
          });
          setOrganizedImages(fallbackOrganized);
          setTotalImages(localGalleryImages.length);
        }
      } catch (error) {
        console.error('Error loading gallery images:', error);
        // Fallback to local images only
        const fallbackOrganized: { [key: string]: GalleryImage[] } = {};
        localGalleryImages.forEach(img => {
          if (!fallbackOrganized[img.category]) {
            fallbackOrganized[img.category] = [];
          }
          fallbackOrganized[img.category].push(img);
        });
        setOrganizedImages(fallbackOrganized);
        setTotalImages(localGalleryImages.length);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrganizedGalleryImages();
  }, [localGalleryImages]);

  // Get images for specific folder
  const getFolderImages = useCallback((folderKey: string): GalleryImage[] => {
    return organizedImages[folderKey] || [];
  }, [organizedImages]);

  // Get all images
  const getAllImages = useCallback((): GalleryImage[] => {
    const allImages: GalleryImage[] = [];
    Object.values(organizedImages).forEach(images => {
      allImages.push(...images);
    });
    return allImages;
  }, [organizedImages]);

  // Lightbox navigation
  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
    setLightboxOpen(true);
  };

  const handlePrevImage = useCallback(() => {
    if (!selectedImage) return;
    const currentImages = selectedFolder ? getFolderImages(selectedFolder) : getAllImages();
    const currentIndex = currentImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : currentImages.length - 1;
    setSelectedImage(currentImages[prevIndex]);
  }, [selectedImage, selectedFolder, getAllImages, getFolderImages]);

  const handleNextImage = useCallback(() => {
    if (!selectedImage) return;
    const currentImages = selectedFolder ? getFolderImages(selectedFolder) : getAllImages();
    const currentIndex = currentImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = currentIndex < currentImages.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(currentImages[nextIndex]);
  }, [selectedImage, selectedFolder, getAllImages, getFolderImages]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setLightboxOpen(false);
    if (e.key === "ArrowLeft") handlePrevImage();
    if (e.key === "ArrowRight") handleNextImage();
  }, [handlePrevImage, handleNextImage]);

  // Add keyboard event listeners
  useEffect(() => {
    if (lightboxOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [lightboxOpen, selectedImage, handleKeyDown]);

  // Main folder view
  const renderFolderView = () => {
    const allImages = getAllImages();

    return (
      <div className="space-y-8">
        {/* All Photos Quick Access */}
        <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 rounded-2xl p-8 shadow-lg border-2 border-[hsl(218,31%,18%)]/10 hover:border-[hsl(218,31%,18%)]/20 animate-in fade-in-50 slide-in-from-bottom-4 duration-700 hover:shadow-2xl transition-all duration-300 group backdrop-blur-sm">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-[hsl(45,56%,55%)] group-hover:h-2 transition-all duration-300 rounded-t-xl -mx-8 -mt-8 mb-6"></div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-[hsl(218,31%,18%)] text-white rounded-xl hover:scale-105 transition-transform duration-300 shadow-lg group-hover:shadow-xl">
                <ImageIcon className="h-8 w-8" />
              </div>
              <div>
                <h2 className="mobile-text-2xl font-bold tracking-tight text-[hsl(218,31%,18%)] dark:text-gray-100">All Photos</h2>
                <p className="mobile-text-base text-gray-600 dark:text-gray-400">Browse through all our church memories</p>
              </div>
            </div>
            <Badge className="bg-[hsl(45,56%,55%)] !text-[hsl(218,31%,18%)] text-lg px-4 py-2 font-semibold shadow-sm border-0">
              {allImages.length} photos
            </Badge>
          </div>

          {/* Preview grid of all photos */}
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
            {allImages.slice(0, 8).map((image, index) => (
              <div
                key={image.id}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-110 transition-all duration-300 hover:shadow-lg hover:ring-2 hover:ring-[hsl(218,31%,18%)]/30 shadow-sm"
                onClick={() => handleImageClick(image)}
              >
                <Image
                  src={image.thumbnailSrc || image.src}
                  alt={image.alt}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          <Button
            onClick={() => setSelectedFolder('all')}
            className="w-full bg-gradient-to-r from-[hsl(218,31%,18%)] to-[hsl(218,28%,25%)] hover:from-[hsl(218,28%,25%)] hover:to-[hsl(218,31%,15%)] text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl shadow-lg"
          >
            <ImageIcon className="h-5 w-5 mr-2" />
            View All {allImages.length} Photos
          </Button>
        </div>

        {/* Folder Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {GALLERY_FOLDERS.map((folder) => {
            const folderImages = getFolderImages(folder.key);
            const IconComponent = folder.icon;

            return (
              <Card
                key={folder.key}
                className={`group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1 border-2 ${folder.borderColor} ${folder.bgColor} backdrop-blur-sm animate-in fade-in-50 slide-in-from-bottom-4`}
                onClick={() => setSelectedFolder(folder.key)}
              >
                <CardContent className="p-0 relative">
                  {/* Top accent bar */}
                  <div className={`h-1 w-full ${folder.accentColor} group-hover:h-2 transition-all duration-300`}></div>

                  <div className="p-6">
                    {/* Icon Section */}
                    <div className="flex items-center justify-center mb-6">
                      <div className={`p-4 rounded-2xl ${folder.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                    </div>

                    {/* Image preview grid */}
                    {folderImages.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden mb-6 bg-gray-100 dark:bg-gray-700 p-2">
                        {folderImages.slice(0, 4).map((image, index) => (
                          <div key={image.id} className="aspect-square overflow-hidden rounded-lg shadow-sm">
                            <Image
                              src={image.thumbnailSrc || image.src}
                              alt={image.alt}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        ))}
                        {folderImages.length < 4 &&
                          Array.from({ length: 4 - folderImages.length }).map((_, index) => (
                            <div key={`placeholder-${index}`} className="aspect-square bg-gray-200 dark:bg-gray-600 flex items-center justify-center rounded-lg">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          ))
                        }
                      </div>
                    ) : (
                      <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-6">
                        <div className="text-center">
                          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No photos yet</p>
                        </div>
                      </div>
                    )}

                    {/* Folder Info */}
                    <div className="text-center space-y-3">
                      <h3 className="font-bold text-lg text-[hsl(218,31%,18%)] dark:text-gray-100 group-hover:text-[hsl(218,31%,15%)] transition-colors duration-300">
                        {folder.name}
                      </h3>

                      <div className="flex items-center justify-center">
                        <Badge className={`${folder.color} shadow-sm px-3 py-1 text-sm font-medium`}>
                          {folderImages.length} {folderImages.length === 1 ? 'photo' : 'photos'}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                        {folderImages.length === 0
                          ? `No ${folder.name.toLowerCase()} photos yet`
                          : `Explore ${folder.name.toLowerCase()} memories`
                        }
                      </p>
                    </div>

                    {/* Hover arrow indicator */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className={`p-2 rounded-full ${folder.accentColor} shadow-lg`}>
                        <ChevronRight className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  // Individual folder content view
  const renderFolderContent = () => {
    if (!selectedFolder) return null;

    if (selectedFolder === 'all') {
      const allImages = getAllImages();
      return (
        <div className="space-y-6">
          {/* Breadcrumb and header */}
          <Breadcrumbs
            items={[
              { name: "Gallery", url: "/gallery" },
              { name: "All Photos", url: "" }
            ]}
            className="mb-4"
          />
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => setSelectedFolder(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Folders
            </Button>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-[hsl(218,31%,18%)] dark:text-[hsl(218,31%,70%)]" />
              <h2 className="mobile-text-lg font-semibold text-gray-900 dark:text-gray-100">All Photos</h2>
              <Badge variant="secondary">{allImages.length}</Badge>
            </div>
          </div>

          {/* Images grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allImages.map((image) => (
              <Card key={image.id} className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border-0 hover:ring-2 hover:ring-[hsl(218,31%,18%)]/20">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={image.thumbnailSrc || image.src}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      onClick={() => handleImageClick(image)}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    const folder = GALLERY_FOLDERS.find(f => f.key === selectedFolder);
    const folderImages = getFolderImages(selectedFolder);

    if (!folder) return null;

    const IconComponent = folder.icon;

    return (
      <div className="space-y-6">
        {/* Breadcrumb and header */}
        <Breadcrumbs
          items={[
            { name: "Gallery", url: "/gallery" },
            { name: folder.name, url: "" }
          ]}
          className="mb-4"
        />
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedFolder(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Folders
          </Button>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${folder.color}`}>
              <IconComponent className="h-5 w-5" />
            </div>
            <h2 className="mobile-text-lg font-semibold text-gray-900 dark:text-gray-100">{folder.name}</h2>
            <Badge variant="secondary">{folderImages.length}</Badge>
          </div>
        </div>

        {folderImages.length === 0 ? (
          <div className="text-center py-20">
            <div className={`p-6 rounded-full ${folder.color} inline-block mb-4`}>
              <IconComponent className="h-16 w-16" />
            </div>
            <h3 className="mobile-text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">No {folder.name.toLowerCase()} photos yet</h3>
            <p className="mobile-text-base text-gray-500 dark:text-gray-500">Check back soon for photos from our {folder.name.toLowerCase()} events!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {folderImages.map((image) => (
              <Card key={image.id} className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border-0 hover:ring-2 hover:ring-[hsl(218,31%,18%)]/20">
                <CardContent className="p-0">
                  <div className="relative aspect-square">
                    <Image
                      src={image.thumbnailSrc || image.src}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      onClick={() => handleImageClick(image)}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <PageHeader
        title="Church Gallery"
        description="Capturing precious moments of faith, fellowship, and worship in our church community"
        backgroundImage="/images/gallery/Church1.jpg"
        minHeight="sm"
        overlay="medium"
        blurBackground={true}
        backgroundPosition="50% 25%"
      />

      {/* Breadcrumbs */}
      <div className="container px-4 md:px-6 pt-8">
        <Breadcrumbs
          items={[
            { name: "Home", url: "/" },
            { name: "Gallery", url: "" }
          ]}
        />
      </div>

      {/* Gallery Content */}
      <section className="w-full py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[hsl(218,31%,18%)] dark:text-[hsl(218,31%,70%)]" />
              <span className="ml-2 text-gray-600">Loading gallery images...</span>
            </div>
          )}

          {!isLoading && (
            selectedFolder ? renderFolderContent() : renderFolderView()
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Previous Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
              onClick={handlePrevImage}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            {/* Next Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
              onClick={handleNextImage}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
