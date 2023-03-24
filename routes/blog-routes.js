import express from 'express'
import blogController from '../controllers/blog-controller.js'
import auth from '../middleware/auth.js'
const blogRouter=express.Router()
blogRouter.get('/allblogs',auth,blogController.getallBlogs)
blogRouter.post('/add',blogController.addBlog)
blogRouter.put('/update/:id',blogController.updateBlog)
blogRouter.get('/:id',blogController.getByid)
blogRouter.delete('/:id',blogController.deleteBlog)
blogRouter.get('/user/:id',blogController.usersBlogs)
export default blogRouter