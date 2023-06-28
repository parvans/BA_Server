import mongoose from "mongoose";

const userSchema = {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required:true
};

export const Draft = mongoose.model(
  "Draft",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    userId: userSchema,
  },{timestamps:true})
);

