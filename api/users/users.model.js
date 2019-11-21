import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const userSchema = Schema({
  userName: String,
  email: String,
  password: String
}).plugin(timestamps);

export const Users = mongoose.model("users", userSchema);
