import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const categorySchema = Schema({
  name: String,
  image: String
}).plugin(timestamps);

export const Category = mongoose.model("category", categorySchema);
