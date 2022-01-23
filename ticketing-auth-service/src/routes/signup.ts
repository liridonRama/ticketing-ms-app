import { NextFunction, Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { BadRequestError } from '../errors/bad-request-error';
import { RequestValidationError } from "../errors/request-validation-error";
import { User } from '../models/user';

const router = Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(new RequestValidationError(errors.array()));
    }

    const { email, password } = req.body;

    const exists = await User.findOne({ email })
    if (!!exists) {
      return next(new BadRequestError("user with the given email address already exists"));
    }

    const user = User.build({ email, password })
    await user.save();

    res.status(201).send(user);
  }
);

export { router as signupRouter };
