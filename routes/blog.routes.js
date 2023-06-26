import express from 'express'
import { addBlog, deleteBlog, deleteDraft, getADraft, getallBlogs, getByid, getDrafts, publishDraft, saveToDraft, updateBlog, updateDraft, usersBlogs } from '../controllers/blog-controller.js'
import auth from '../middleware/auth.js'
const blogRouter=express.Router()
blogRouter.get('/allblogs',auth,getallBlogs)
blogRouter.post('/add',auth,addBlog)
blogRouter.put('/updateblog',auth,updateBlog)
blogRouter.get('/getablog',auth,getByid)
blogRouter.delete('/deleteblog',auth,deleteBlog)
blogRouter.get('/myblogs',auth,usersBlogs)

blogRouter.post('/savetodraft',auth,saveToDraft)
blogRouter.get('/getdrafts',auth,getDrafts)
blogRouter.get('/getadraft',auth,getADraft)
blogRouter.put('/updatdraft',auth,updateDraft)
blogRouter.delete('/deletedraft',auth,deleteDraft)
blogRouter.post('/publishdraft',auth,publishDraft)

export default blogRouter