import { ValidationError } from "express-validator";
import { CustomError } from './custom-error';
import { CustomErrorMessage } from './custom-error-message';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super("Validation err");
  }

  serializeErrors(): CustomErrorMessage[] {
    return this.errors.map(err => {
      return { message: err.msg, field: err.param }
    })
  }
}
