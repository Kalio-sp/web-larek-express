import { AppError } from "./error";

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}
