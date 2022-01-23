import { Router } from "express";
import { NotFoundError } from '../errors/not-found-error';

export const globalRouter = Router();


globalRouter.all("*", (_, res) => {
  const err = new NotFoundError();

  res.status(err.statusCode).send(err.serializeErrors())
});
