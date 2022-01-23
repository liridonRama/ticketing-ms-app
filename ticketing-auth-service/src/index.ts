import express from "express";
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from 'cookie-session';

import { currentUserRouter, globalRouter, signinRouter, signoutRouter, signupRouter } from "./routes"
import { errorHandler } from './middlewares/error-handler';


const app = express();
app.set('trust proxy', true);

app.use(json())
app.use(cookieSession({
  signed: false,
  secure: true,
  httpOnly: true,
}));

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.use(globalRouter);


app.use(errorHandler)

const start = async () => {
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth")
    console.log("connected to mongodb")
    app.listen(3000, () => console.log('listening on port 3000'))

  } catch (error) {
    console.log(error)
  }
}

start();