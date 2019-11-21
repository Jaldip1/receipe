import express from "express";

import { usersRouter } from "./users";
import { categoryRouter } from "./category";
import { recipeRouter } from "./recipe";

export const restRouter = express.Router();

// The authorization routes go here Api Routs
restRouter.use("/users", usersRouter);
restRouter.use("/categories", categoryRouter);
restRouter.use("/recipe", recipeRouter);
