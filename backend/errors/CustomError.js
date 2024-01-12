export class CustomError extends Error {
  constructor(content) {
    super(content.message);
    this.content = content;
  }
}
