import express from 'express'
import { addBlog, deleteBlog, getallBlogs, getByid, updateBlog, usersBlogs } from '../controllers/blog-controller.js'
import auth from '../middleware/auth.js'
const blogRouter=express.Router()
blogRouter.get('/allblogs',auth,getallBlogs)
blogRouter.post('/add',auth,addBlog)
blogRouter.put('/updateblog',auth,updateBlog)
blogRouter.get('/getablog',auth,getByid)
blogRouter.delete('/deleteblog',auth,deleteBlog)
blogRouter.get('/myblogs',auth,usersBlogs)
export default blogRouter