import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  maxAttendees?: number;
  currentAttendees?: number;
  registrationRequired?: boolean;
  className?: string;
  isLoading?: boolean;
}

export function EventCard({
  id,
  title,
  description,
  category,
  location,
  startDate,
  endDate,
  imageUrl,
  maxAttendees,
  currentAttendees = 0,
  registrationRequired = false,
  className = '',
  isLoading = false,
}: EventCardProps) {
  if (isLoading) {
    return <EventCardSkeleton />;
  }

  const startDateTime = new Date(startDate);
  const spotsRemaining = maxAttendees ? maxAttendees - currentAttendees : null;
  const isFull = maxAttendees ? currentAttendees >= maxAttendees : false;

  return (
    <Card
      className={`group mobile-card border-0 bg-white dark:bg-gray-800 overflow-hidden transform hover:-translate-y-1 transition-all duration-300 h-full flex flex-col ${className}`}
    >
      {/* Event Image */}
      {imageUrl && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={imageUrl}
            alt={`${title} event image`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-church-accent/90 text-church-primary font-semibold backdrop-blur-sm">
              {category}
            </Badge>
          </div>
        </div>
      )}

      <CardHeader className="mobile-card-spacing flex-grow">
        <CardTitle className="mobile-text-lg line-clamp-2 group-hover:text-church-primary dark:group-hover:text-church-accent transition-colors">
          {title}
        </CardTitle>
        <p className="mobile-text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mt-2">
          {description}
        </p>
      </CardHeader>

      <CardContent className="mobile-card-spacing space-y-2 text-xs sm:text-sm">
        {/* Date and Time */}
        <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-church-primary dark:text-church-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex flex-col">
            <time dateTime={startDate}>
              {format(startDateTime, 'EEEE, MMMM d, yyyy')}
            </time>
            <time dateTime={startDate} className="text-gray-500 dark:text-gray-400 text-xs">
              {format(startDateTime, 'h:mm a')}
            </time>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-church-primary dark:text-church-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
          <span className="line-clamp-2">{location}</span>
        </div>

        {/* Attendees Info */}
        {maxAttendees && (
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-church-primary dark:text-church-accent flex-shrink-0" aria-hidden="true" />
            <span>
              {currentAttendees} / {maxAttendees} registered
              {spotsRemaining !== null && spotsRemaining > 0 && (
                <span className="text-church-accent ml-1">({spotsRemaining} spots left)</span>
              )}
            </span>
          </div>
        )}

        {isFull && (
          <Badge variant="destructive" className="w-fit">
            Event Full
          </Badge>
        )}
      </CardContent>

      <CardFooter className="mobile-card-spacing pt-0">
        <Button
          variant={isFull ? 'outline' : 'default'}
          size="sm"
          className="w-full mobile-button"
          asChild
          disabled={isFull}
          aria-label={`${isFull ? 'View details for' : 'Register for'} ${title}`}
        >
          <Link href={`/events/${id}`}>
            {isFull ? 'View Details' : registrationRequired ? 'Register Now' : 'Learn More'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function EventCardSkeleton() {
  return (
    <Card className="mobile-card border-0 bg-white dark:bg-gray-800 overflow-hidden h-full flex flex-col animate-pulse">
      <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
      <CardHeader className="mobile-card-spacing">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="space-y-2 mt-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        </div>
      </CardHeader>
      <CardContent className="mobile-card-spacing space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </CardContent>
      <CardFooter className="mobile-card-spacing pt-0">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      </CardFooter>
    </Card>
  );
}
