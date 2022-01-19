import { Router } from "express";

export const signoutRouter = Router();


signoutRouter.get("/api/users/signout", (req, res) => {
  res.send("Hello")
})