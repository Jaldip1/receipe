import express from "express";
import { createRecipes, getRecipes, imageUpload } from "./recipe.controller";

export const recipeRouter = express.Router();

recipeRouter.route("/")
  .get(getRecipes)

recipeRouter.route("/create")
  .post(imageUpload.single("image"), createRecipes)
