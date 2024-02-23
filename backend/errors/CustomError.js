export class CustomError extends Error {
  constructor(content) {
    super(content.message);
    this.content = content;
  }
}

export class BadRequestError extends CustomError {
  constructor(message) {
    super({ statusCode: 400, message });
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message) {
    super({ statusCode: 401, message });
  }
}

export class ForbiddenError extends CustomError {
  constructor(message) {
    super({ statusCode: 403, message });
  }
}

export class NotFoundError extends CustomError {
  constructor(message) {
    super({ statusCode: 404, message });
  }
}
