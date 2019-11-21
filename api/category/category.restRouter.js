import express from "express";
import { createCategory, getCategories, imageUpload } from "./category.controller";

export const categoryRouter = express.Router();

categoryRouter.route("/")
  .get(getCategories)

categoryRouter.route("/create")
  .post(imageUpload.single("image"), createCategory)
