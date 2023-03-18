import mongoose from "mongoose";

const blogSchema = {
  type: mongoose.Types.ObjectId,
  ref: "Blog",
  required: true
};

export const User = mongoose.model(
  "User",
  new mongoose.Schema({
    // image: {
    //   type: String,
    //   required: true,
    // },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength:8
    },
    blogs:[blogSchema]
  },{
    timestamps:true
  })
);

