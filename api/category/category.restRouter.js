import express from "express";
import { createCategory, imageUpload } from "./category.controller";

export const categoryRouter = express.Router();

categoryRouter.route("/create")
  .post(imageUpload.single("image"), createCategory)
