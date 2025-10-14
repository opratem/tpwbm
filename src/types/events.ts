export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  startDate: string;
  endDate: string;
  location: string;
  address?: string;
  organizer: string;
  organizerId: string;
  capacity?: number;
  registeredCount: number;
  requiresRegistration: boolean;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  recurringDays?: string[];
  recurringEndDate?: string;
  status: EventStatus;
  imageUrl?: string; // Keep for backward compatibility
  imageUrls?: string[]; // New field for multiple images
  contactEmail?: string;
  contactPhone?: string;
  tags: string[];
  price?: number;
  registrationDeadline?: string;
  createdAt: string;
  updatedAt: string;
}

export type EventCategory =
  | "worship"
  | "fellowship"
  | "youth"
  | "workers"
  | "prayers"
  | "thanksgiving"
  | "outreach"
  | "ministry"
  | "special_program"
  | "community";

export type EventStatus =
  | "draft"
  | "published"
  | "cancelled"
  | "completed";

export type RecurringPattern =
  | "daily"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "yearly";

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  registrationDate: string;
  notes?: string;
  status: "registered" | "waitlist" | "cancelled";
}

export interface CalendarView {
  type: "month" | "week" | "day" | "agenda";
  date: Date;
}

export interface EventFilter {
  category?: EventCategory | "all";
  status?: EventStatus | "all";
  startDate?: string;
  endDate?: string;
  upcoming?: boolean;
  search?: string;
}

export interface EventFormData {
  title: string;
  description: string;
  category: EventCategory;
  startDate: string;
  endDate: string;
  location: string;
  address?: string;
  organizer?: string; // New explicit organizer field
  capacity?: number;
  requiresRegistration: boolean;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  recurringDays?: string[];
  recurringEndDate?: string;
  contactEmail?: string;
  contactPhone?: string;
  tags: string[];
  price?: number;
  registrationDeadline?: string;
  imageUrl?: string; // Keep for backward compatibility
  imageUrls?: string[]; // New field for multiple images
}

export interface CalendarEvent extends Event {
  color?: string;
  allDay?: boolean;
  extendedProps?: Record<string, unknown>;
}
