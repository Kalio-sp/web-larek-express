import { AppError } from "./error";

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}
