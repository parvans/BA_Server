import { Blog } from "../models/Blog.js";
import { User } from "../models/User.js";
   
export const getallBlogs = async (req, res) => {
    let blogs;
    try {
        blogs = await Blog.find().populate("userId").populate("userId").sort({ createdAt: -1 });
    } catch (err) {
        console.log(err);
    }
    if (!blogs) {
        return res.status(404).json({ message: "No Blogs Found" });
    } else {
        return res.status(200).json({ data: blogs });
    }
}

export const addBlog = async (req, res, next) => {
    const {title,description}=req.body
    const userId=req.user.id
    let existingUser;
    try{
        existingUser=await User.findById({_id:userId})
        
    }catch(err){
        return console.log(err);
    }
    if(!existingUser){
        return res.status(400).json({message:"Unable to find the user with this id"})
    }
    const theDesc=description.split(' ').map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()).join(" ");
    const theTitle=title.split(' ').map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()).join(" ");
    const exBlog=await Blog.findOne({title:theTitle})
    if(exBlog){
        return res.status(400).json({message:"Blog with this title already exists"})
    }
    const newBlog=new Blog({
        title:theTitle,
        description:theDesc,
        userId
    })
    try{
        // const session=await mongoose.startSession()
        // session.startTransaction();
        // await newBlog.save({session})
        // existingUser.blogs.push(newBlog)
        // await r.save({session})
        // await session.commitTransaction()

        const result=await newBlog.save()
        existingUser.blogs.push(result)
        await existingUser.save()
    }catch(err){
        console.log(err);
        return res.status(500).json({message:err})
    }
    return res.status(200).json({newBlog})
}

export const updateBlog = async (req, res) => {
    const {title,description}=req.body
    const blogId=req.query.id
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

}

export const getByid = async (req, res) => {
    const blogId=req.query.id
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
}

export const deleteBlog = async (req, res) => {
    const blogId=req.query.id
    let blog;
    try{
        blog=await Blog.findById(blogId)
        if(!blog){
            return res.status(404).json({message:'Unable To Delete'})
        }else{
            await Blog.findByIdAndDelete(blogId)
            return res.status(200).json({message:'Blog Successfully Deleted'})
        }
    }catch(err){
        console.log(err);
    }
}

export const usersBlogs = async (req, res) => {
    const userId=req.user.id
    let userBlogs;
    try{
        userBlogs=await User.findById(userId).select('blogs').populate('blogs')
    }catch(err){
        return console.log(err);
    }
    if(!userBlogs){
        return res.status(404).json({message:"No Blogs Found"})
    }
    return res.status(200).json({data:userBlogs.blogs.reverse()})
}

