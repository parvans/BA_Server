import mongoose from "mongoose";

const userSchema = {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required:true
};

const commentSchema = {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Comment",
  required:true
};
export const Blog = mongoose.model(
  "Blog",
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
    // date:{
    //   type:Date,
    //   default:Date.now
    // },
    userId: userSchema,
    likes: [userSchema],
    comments:[commentSchema],
  },{timestamps:true})
);

