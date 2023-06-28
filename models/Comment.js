import mongoose from "mongoose";

const userSchema = {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required:true
};
export const Comment = mongoose.model(
  "Comment",
  new mongoose.Schema({
    comment: {  
        type: String,
        required: true,
        },
    userId: userSchema,
    blogId: userSchema,
    
  },{timestamps:true})
);

