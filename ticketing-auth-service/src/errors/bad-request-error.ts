import { CustomError } from './custom-error';
import { CustomErrorMessage } from './custom-error-message';


export class BadRequestError extends CustomError {
  public statusCode = 400;


  constructor(public message: string = 'Bad Request') {
    super(message);

  }


  public serializeErrors(): CustomErrorMessage[] {
    return [{
      message: this.message,
    }]
  }

}