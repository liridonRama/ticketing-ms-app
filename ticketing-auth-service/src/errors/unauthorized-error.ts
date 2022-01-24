import { CustomError } from './custom-error';
import { CustomErrorMessage } from './custom-error-message';

export class UnauthorizedError extends CustomError {
  public statusCode = 401;

  constructor() {
    super("Not Authorized");
  }


  public serializeErrors(): CustomErrorMessage[] {
    return [{
      message: "Not Authorized",
    }]
  }

}