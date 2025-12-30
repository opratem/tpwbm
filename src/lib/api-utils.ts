/**
 * API Utilities for consistent error handling and response formatting
 */

import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Standard API error types
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public code?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

// Common error responses
export const ApiErrors = {
  unauthorized: () => new APIError("Unauthorized access", 401, "UNAUTHORIZED"),
  forbidden: () => new APIError("Forbidden access", 403, "FORBIDDEN"),
  notFound: (resource = "Resource") =>
    new APIError(`${resource} not found`, 404, "NOT_FOUND"),
  badRequest: (message = "Bad request") =>
    new APIError(message, 400, "BAD_REQUEST"),
  validationError: (message = "Validation error") =>
    new APIError(message, 422, "VALIDATION_ERROR"),
  internalError: (message = "Internal server error") =>
    new APIError(message, 500, "INTERNAL_ERROR"),
  conflict: (message = "Resource already exists") =>
    new APIError(message, 409, "CONFLICT"),
};

// Success response helper
export function successResponse<T>(data: T, statusCode = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status: statusCode }
  );
}

// Error response helper
export function errorResponse(
  error: Error | APIError | ZodError,
  statusCode?: number
) {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation error",
        code: "VALIDATION_ERROR",
        details: error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      },
      { status: 422 }
    );
  }

  // Handle custom API errors
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  // Handle generic errors
  const status = statusCode || 500;
  return NextResponse.json(
    {
      success: false,
      error: error.message || "Internal server error",
      code: "INTERNAL_ERROR",
    },
    { status }
  );
}

// Async handler wrapper for error handling
export function asyncHandler(
  handler: (req: Request, context?: any) => Promise<NextResponse>
) {
  return async (req: Request, context?: any) => {
    try {
      return await handler(req, context);
    } catch (error) {
      console.error("API Error:", error);
      return errorResponse(
        error instanceof Error
          ? error
          : new Error("Unknown error occurred")
      );
    }
  };
}

// Pagination helper
export function parsePagination(searchParams: URLSearchParams) {
  const page = Number.parseInt(searchParams.get("page") || "1", 10);
  const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  return {
    page,
    limit: Math.min(limit, 100), // Max 100 items per page
    offset,
  };
}

// Pagination response helper
export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  return successResponse({
    items: data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
}

