import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/unauthorized-error';


interface UserPayload {
  id: string;
  email: string;
}


declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    next(new UnauthorizedError());
    return;
  }

  next();
}