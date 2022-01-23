import express from "express";
import { json } from "body-parser";

import { currentUserRouter, signinRouter, signoutRouter, signupRouter } from "./routes"
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(json())

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)
app.use(errorHandler)

app.all("*", (_, res) => {
  const err = new NotFoundError();

  return res.status(err.statusCode).send(err.serializeErrors())
});

app.get("/api/users/current-user", (req, res) => {
  res.send("HI THERE")
});


app.listen(3000, () => console.log('listening on port 3000'))