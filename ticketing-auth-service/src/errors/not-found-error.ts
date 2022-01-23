import { CustomError } from './custom-error';
import { CustomErrorMessage } from './custom-error-message';

export class NotFoundError extends CustomError {
  public statusCode = 404;

  constructor() {
    super("Route not found");
  }


  public serializeErrors(): CustomErrorMessage[] {
    return [{
      message: 'Not Found',
    }]
  }

}