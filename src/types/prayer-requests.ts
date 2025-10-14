export interface PrayerRequest {
  id: string;
  title: string;
  description: string;
  category: PrayerRequestCategory;
  priority: PrayerRequestPriority;
  requestedBy: string;
  requestedById: string;
  requestedByEmail?: string;
  isAnonymous: boolean;
  status: PrayerRequestStatus;
  isPublic: boolean;
  tags: string[];
  prayerCount: number;
  prayedByUsers: string[]; // User IDs who prayed for this request
  followUpNotes?: string;
  adminNotes?: string;
  answeredDate?: string;
  answeredDescription?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export type PrayerRequestCategory =
    | "health"
    | "family"
    | "work"
    | "spiritual"
    | "financial"
    | "relationships"
    | "ministry"
    | "community"
    | "salvation"
    | "thanksgiving"
    | "other";

export type PrayerRequestPriority =
    | "urgent"
    | "high"
    | "normal"
    | "low";

export type PrayerRequestStatus =
    | "pending"
    | "approved"
    | "active"
    | "answered"
    | "expired"
    | "archived";

export interface PrayerRequestFormData {
  title: string;
  description: string;
  category: PrayerRequestCategory;
  priority: PrayerRequestPriority;
  isAnonymous: boolean;
  isPublic: boolean;
  tags?: string[];
  expiresAt?: string;
}

export interface PrayerResponse {
  id: string;
  prayerRequestId: string;
  userId: string;
  userName: string;
  response?: string;
  isPrayed: boolean;
  prayedAt: string;
}

export interface PrayerRequestFilter {
  category?: PrayerRequestCategory | "all";
  status?: PrayerRequestStatus | "all";
  priority?: PrayerRequestPriority | "all";
  search?: string;
  isPublic?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface PrayerRequestStats {
  total: number;
  active: number;
  answered: number;
  pending: number;
  thisWeek: number;
  thisMonth: number;
  totalPrayers: number;
}

export interface PrayerListItem {
  id: string;
  title: string;
  category: PrayerRequestCategory;
  priority: PrayerRequestPriority;
  requestedBy: string;
  isAnonymous: boolean;
  prayerCount: number;
  hasPrayed: boolean;
  createdAt: string;
}
