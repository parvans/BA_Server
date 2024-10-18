import { Blog } from "../models/Blog.js";
import { User } from "../models/User.js";
import { firstNameSecondNameCapForReg, isEmpty, isNull, ReE, ReS, too, uppperEveryWord } from "../services/util.service.js";
import cloudNary from "../utils/cloudinary.js";
import HttpStatus from "http-status"


export const getallBlogs = async (req, res) => {
    let err;
    let blogs;
    [err,blogs]= await too(Blog.find({}).populate("author").sort({ createdAt: -1 }));

    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if(!isEmpty(blogs)){
        return ReS(res,{ message: "All Blogs",data:blogs},HttpStatus.OK);
    }
    // try {
    //     blogs = await Blog.find().populate("author").sort({ createdAt: -1 });
    // } catch (err) {
    //     console.log(err);
    // }
    // if (!blogs) {
    //     return res.status(404).json({ message: "No Blogs Found" });
    // } else {
    //     return res.status(200).json({ data: blogs });
    // }
}
export const usersBlogs = async (req, res) => {
    const userId=req.user.id
    let userBlogs;
    let filterBlogs;
    try{
        userBlogs=await User.findById({_id:userId}).select('blogs').populate('blogs').sort({createdAt:-1})
        filterBlogs=userBlogs.blogs.filter((blog)=>blog.isDraft===false && blog.isTrash===false)
    }catch(err){
        return console.log(err);
    }
    if(!userBlogs){
        return res.status(404).json({message:"No Blogs Found"})
    }
    return res.status(200).json({data:filterBlogs.reverse()})
}
export const getByid = async (req, res) => {
    const blogId=req.query.id
    let blog;
    try{
        blog=await Blog.findById(blogId).populate({path:'userId',select:'name email'})
    }catch(err){
        console.log(err);
    }
    if(!blog){
        return res.status(404).json({message:'No Blog Found'})
    }else{
        return res.status(200).json({blog})
    }
}

export const addBlog = async (req, res) => {

    let err;
    const body=req.body;
    const fields = ["title", "summary","content"];
    const image=req.body.data;
    const userId=req.user.id

    let inVaildFields = fields.filter(x => isNull(body[x]));

    if(!isEmpty(inVaildFields)){
        return ReE(res,{ message: `Please enter required fields ${inVaildFields}!.` }, HttpStatus.BAD_REQUEST);
    }

    const {title,summary,content}=body;

    let checkUser;
    [err,checkUser]=await too(User.findById(userId));

    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    if (isNull(checkUser)) {
        return ReE(res,{ message: "User does not exit." },HttpStatus.BAD_REQUEST);
    }

    const perfectTitle=uppperEveryWord(title);

    let existBlog;
    [err,existBlog]=await too(Blog.findOne({$or:[{title:title},{title:perfectTitle}]}))


    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    if(!isNull(existBlog)){
        return ReE(res,{message:"The title is already taken"},HttpStatus.BAD_REQUEST);
    }

    const uploadResponse = await cloudNary.uploader.upload(image,{upload_preset: 'blog_images'})

    const createBlog=new Blog({
        title:perfectTitle,
        summary:summary,
        content:content,
        image:uploadResponse.url,
        author:userId
    }).save();

    if (!isNull(createBlog)) {
        return ReS(res,{ message: "Blog added Successfully"},HttpStatus.OK);
    }





    // // const image=req.body.data
    // let existingUser;
    // try{
    //     existingUser=await User.findById({_id:userId})
    //     if(!existingUser){
    //         return res.status(400).json({message:"Unable to find the user with this id"})
    //     }
    // }catch(err){
    //     return console.log(err);
    // }
    // // const theDesc=description.split(' ').map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()).join(" ");
    // const theTitle=title.split(' ').map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()).join(" ");
    // const exBlog=await Blog.findOne({title:theTitle})
    // if(exBlog){
    //     return res.status(400).json({message:"Blog with this title already exists"})
    // }
    // // const uploadResponse = await cloudNary.uploader.upload(image,{upload_preset: 'blog_images'})
    // const newBlog=new Blog({
    //     title:theTitle,
    //     description:description,
    //     image:uploadResponse.url,
    //     isDraft,
    //     userId
    // })
    // try{
    //     const result=await newBlog.save()
    //     existingUser.blogs.push(result._id)
    //     await existingUser.save()

    // }catch(err){
    //     console.log(err);
    //     return res.status(500).json({message:err})
    // }
    // return res.status(200).json({message:"Blog added successfully"})
}

export const updateBlog = async (req, res) => {
    // const {title,description}=req.body
    const blogId=req.query.id
        try {
        const blogExist=await Blog.findById(blogId)
        if(!blogExist){
            return res.status(404).json({message:"No Blog Found"})
        }
            await Blog.findByIdAndUpdate(blogId,req.body,{new:true})
            res.status(200).json({message:"Blog updated successfully"})
        } catch (error) {
            console.log(error);
        }

}


export const deleteBlog = async (req, res) => {
    const blogId=req.query.id
    let blog;
    try{
        blog=await Blog.findById(blogId)
        if(!blog){
            return res.status(404).json({message:'No Blog Found'})
        }else{
            await cloudNary.uploader.destroy(blog.image)
            await Blog.findByIdAndDelete(blogId)
            await User.findByIdAndUpdate(blog.userId,{$pull:{blogs:blogId}})
            return res.status(200).json({message:'Blog Successfully Deleted'})
        }
    }catch(err){
        console.log(err);
    }
}

export const moveToTrash = async (req, res) => {
    const blogId=req.query.id
    let blog;
    try {
        blog=await Blog.findById(blogId)
        if(!blog){
            return res.status(404).json({message:'No Blog Found'})
        }else{
            await Blog.findByIdAndUpdate(blogId,{isTrash:true,isDraft:false})
            // await User.findByIdAndUpdate(blog.userId,{$pull:{blogs:blogId}})
            return res.status(200).json({message:'Blog Successfully Moved to Trash'})
        }
    } catch (error) {
        console.log(err);
    }
}

export const moveToDraft=async(req,res)=>{
    const blogId=req.query.id
    let blog;
    try {
        blog=await Blog.findById(blogId)
        if(!blog){
            return res.status(404).json({message:'No Blog Found'})
        }else{
            await Blog.findByIdAndUpdate(blogId,{isTrash:false,isDraft:true})
            // await User.findByIdAndUpdate(blog.userId,{$pull:{blogs:blogId}})
            return res.status(200).json({message:'Blog Successfully Moved to Draft'})
        }
    } catch (error) {
        console.log(err);
    }
}

export const getUserDraftBlogs = async (req, res) => {
    const userId=req.user.id
    let blogs;
    let draftBlogs;
    try {
        blogs = await User.findById({_id:userId,}).select('blogs').populate('blogs').sort({ createdAt: -1 });
        draftBlogs=blogs.blogs.filter((blog)=>blog.isDraft===true)
    } catch (err) {
        console.log(err);
    }
    if (!blogs) {
        return res.status(404).json({ message: "No Blogs Found" });
    } else {
        return res.status(200).json({ data: draftBlogs });
    }
}

export const getUserTrashBlogs = async (req, res) => {
    const userId=req.user.id
    let blogs;
    let trashBlogs;
    try {
        blogs = await User.findById({_id:userId}).select('blogs').populate('blogs').sort({ createdAt: -1 });
        // console.log(blogs);
        trashBlogs=blogs.blogs.filter((blog)=>blog.isTrash===true)
    } catch (err) {
        console.log(err);
    }
    if (!blogs) {
        return res.status(404).json({ message: "No Blogs Found" });
    } else {
        return res.status(200).json({ data: trashBlogs });
    }
}


