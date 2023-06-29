import express from "express";
import {
  addBlog,
  deleteBlog,
  getallBlogs,
  getByid,
  getUserDraftBlogs,
  getUserTrashBlogs,
  moveToDraft,
  moveToTrash,
  updateBlog,
  usersBlogs,
} from "../controllers/blog-controller.js";
import auth from "../middleware/auth.js";
const blogRouter = express.Router();
blogRouter.get("/allblogs", auth, getallBlogs);
blogRouter.post("/add", auth, addBlog);
blogRouter.put("/updateblog", auth, updateBlog);
blogRouter.get("/getablog", auth, getByid);
blogRouter.delete("/deleteblog", auth, deleteBlog);
blogRouter.get("/myblogs", auth, usersBlogs);

blogRouter.put("/movetotrash", auth, moveToTrash);
blogRouter.get("/mytrashblogs", auth, getUserTrashBlogs);

blogRouter.put("/movetodraft", auth, moveToDraft);
blogRouter.get("/getuserdrafts", auth, getUserDraftBlogs);


export default blogRouter;
