import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const recipeSchema = Schema({
  recipeName: String,
  image: String,
  cookingTime: String,
  category: String,
}).plugin(timestamps);

export const Recipe = mongoose.model("recipe", recipeSchema);
