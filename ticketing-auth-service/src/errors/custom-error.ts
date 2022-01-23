import { CustomErrorMessage } from './custom-error-message';

export abstract class CustomError extends Error {
  public abstract statusCode: number;

  constructor(msg: string) {
    super(msg)
  }

  public abstract serializeErrors(): CustomErrorMessage[];
}
