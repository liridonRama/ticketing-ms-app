import { Router } from "express";

export const signoutRouter = Router();


signoutRouter.get("/api/users/signout", (req, res) => {
  req.session = null;

  res.status(200).end();
})