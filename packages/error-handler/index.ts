export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    details?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this);
  }
}

// Not Found Error
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

// validation Error
export class ValidationError extends AppError {
  constructor(message = "Invalid request data", details?: any) {
    super(message, 400, true, details);
  }
}

// Authorization Error
export class AuthError extends AppError {
  constructor(message = "Unauthorized", details?: any) {
    super(message, 401, true, details);
  }
}

// Forbidden Error
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden access", details?: any) {
    super(message, 403, true, details);
  }
}

//database error
export class DatabaseError extends AppError {
  constructor(message = "Database error occurred", details?: any) {
    super(message, 500, false, details);
  }
}

// External Service Error
export class ExternalServiceError extends AppError {
  constructor(message = "External service error", details?: any) {
    super(message, 502, false, details);
  }
}

// Internal Server Error
export class InternalServerError extends AppError {
  constructor(message = "Internal server error", details?: any) {
    super(message, 500, false, details);
  }
}

// rate limit error
export class RateLimitError extends AppError {
  constructor(
    message = "Too many requests, please try again later.",
    details?: any
  ) {
    super(message, 429, true, details);
  }
}
