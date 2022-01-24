import { NextFunction, Request, Response, Router } from "express";
import { body } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

export const signinRouter = Router();

const validationRules = [
  body('email').isEmail().withMessage("Email must be valid"),
  body('password').trim().notEmpty().withMessage("You must provide a password"),
]


signinRouter.post("/api/users/signin", validationRules, validateRequest, async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const retrievedUser = await User.findOne({ email });
  if (!retrievedUser) {
    return next(new BadRequestError());
  }

  const pwdMatch = await Password.compare(password, retrievedUser?.password || '')

  if (!pwdMatch) {
    return next(new BadRequestError());
  }

  const userJwt = jwt.sign({
    id: retrievedUser.id,
    email: retrievedUser.email,
  }, process.env.JWT_KEY!);

  req.session = {
    jwt: userJwt
  }

  res.status(200).end();
});