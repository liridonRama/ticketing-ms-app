import { Router } from "express";
import { currentUser } from '../middlewares/current-user';

export const currentUserRouter = Router();


currentUserRouter.get("/api/users/currentuser", currentUser, (req, res) => {
  res.status(200).send({ currentUser: req.currentUser || null });
})