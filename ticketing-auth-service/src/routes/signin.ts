import { Router } from "express";

export const signinRouter = Router();


signinRouter.get("/api/users/signin", (req, res) => {
  res.send("Hello")
})