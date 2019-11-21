import express from "express";
import { getRecipes, postRecipes, putRecipes, deleteRecipes, imageUpload } from "./recipe.controller";

export const recipeRouter = express.Router();

recipeRouter.route("/")
  .get(getRecipes)
  .post(imageUpload.single("image"), postRecipes)
  .put(putRecipes)

recipeRouter.route("/:_id")
  .delete(deleteRecipes)
