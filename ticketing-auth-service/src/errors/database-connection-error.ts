import { CustomError } from './custom-error';
import { CustomErrorMessage } from './custom-error-message';

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = "Error connecting to database";

  constructor() {
    super("Error connecting to db");
  }


  serializeErrors(): CustomErrorMessage[] {
    return [
      {
        message: this.reason,
      }
    ]
  }
}
