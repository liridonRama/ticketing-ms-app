import { Router } from "express";

export const currentUserRouter = Router();


currentUserRouter.get("/api/users/currentuser", (req, res) => {
  res.send("Hello")
})