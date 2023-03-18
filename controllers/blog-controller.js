import mongoose from "mongoose";
import { Blog } from "../models/Blog.js";
import { User } from "../models/User.js";
import cloudNary from "../utils/cloudinary.js";
export default {
    getallBlogs:async(req,res,next)=>{
        let blogs;
        try{
            blogs=await Blog.find().populate("user")
        }catch(err){
            console.log(err);
        }
        if(!blogs){
            return res.status(404).json({message:'No Blogs Found'})
        }else{
            return res.status(200).json({blogs})
        }
    },
    addBlog:async(req,res,next)=>{
        const {title,description,image,user}=req.body
        let existingUser;
        try{
            existingUser=await User.findById(user)
        }catch(err){
            return console.log(err);
        }
        if(!existingUser){
            return res.status(400).json({message:"Unable to find the user with this id"})
        }
        const uploadedResponse=await cloudNary.uploader.upload(image,{
            upload_preset:'blog_images'
        })
        const newBlog=new Blog({
            title,
            description,
            image,
            //:uploadedResponse.public_id,
            user
        })
        try{
            const session=await mongoose.startSession()
            session.startTransaction();
            await newBlog.save({session})
            existingUser.blogs.push(newBlog)
            await existingUser.save({session})
            await session.commitTransaction()
        }catch(err){
            console.log(err);
            return res.status(500).json({message:err})
        }
        return res.status(200).json({newBlog})
    },
    updateBlog:async(req,res,next)=>{
        const {title,description}=req.body
        const blogId=req.params.id
        let blog
        try{
            blog=await Blog.findByIdAndUpdate(blogId,{
                title,
                description
            })
        }catch(err){
            return console.log(err);
        }
        if(!blog){
            return res.status(500).json({message:"Unable to update the blog"})
        }
        return res.status(200).json({blog})
    },
    getByid:async(req,res,next)=>{
        const blogId=req.params.id
        let blog;
        try{
            blog=await Blog.findById(blogId)
        }catch(err){
            console.log(err);
        }
        if(!blog){
            return res.status(404).json({message:'No Blog Found'})
        }else{
            return res.status(200).json({blog})
        }
    },
    deleteBlog:async(req,res,next)=>{
        const blogId=req.params.id
        let blog;
        try{
            blog=await Blog.findByIdAndRemove(blogId).populate('user')
            await blog.user.blogs.pull(blog)
            await blog.user.save()
        }catch(err){
            console.log(err);
        }
        if(!blog){
            return res.status(404).json({message:'Unable To Delete'})
        }else{
            return res.status(200).json({message:'Blog Successfully Deleted'})
        }
    },
    usersBlogs:async(req,res,next)=>{
        const userId=req.params.id
        let userBlogs;
        try{
            userBlogs=await User.findById(userId).populate("blogs")
        }catch(err){
            return console.log(err);
        }
        if(!userBlogs){
            return res.status(404).json({message:"No Blogs Found"})
        }
        return res.status(200).json({user:userBlogs})
    }
}