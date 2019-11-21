import express from "express";
import { createUser, onLogin, putUser } from "./users.controller"


export const usersRouter = express.Router();

usersRouter.route("/")
  .post(createUser)
  .put(putUser)

usersRouter.route("/login")
  .post(onLogin)
