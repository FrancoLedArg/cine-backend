export class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = "CustomError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends CustomError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends CustomError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

export class ConflictError extends CustomError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

export class DatabaseError extends CustomError {
  constructor(message = "Database Error") {
    super(message, 500);
  }
}
