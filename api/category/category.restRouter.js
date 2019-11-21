import express from "express";
import { getCategories, postCategory, putCategory, deleteCategory, imageUpload } from "./category.controller";

export const categoryRouter = express.Router();

categoryRouter.route("/")
  .get(getCategories)
  .post(imageUpload.single("image"), postCategory)
  .put(putCategory)

categoryRouter.route("/:_id")
  .delete(deleteCategory)
