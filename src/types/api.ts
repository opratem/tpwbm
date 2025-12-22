/**
 * Common API Response Types
 */

// Standard API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  details?: Array<{
    path: string;
    message: string;
  }>;
}

// Pagination metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Paginated response
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

// Common query parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SearchParams extends PaginationParams {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Session user type
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "member" | "visitor";
  image?: string;
}
