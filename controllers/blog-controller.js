import { Blog } from "../models/Blog.js";
import { Draft } from "../models/Draft.js";
import { User } from "../models/User.js";
import cloudNary from "../utils/cloudinary.js";
   
export const getallBlogs = async (req, res) => {
    let blogs;
    try {
        blogs = await Blog.find({ isDraft: false, isTrash: false })
        .populate("userId").populate("userId").sort({ createdAt: -1 });
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
    const image=req.body.data
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
    // const theDesc=description.split(' ').map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()).join(" ");
    const theTitle=title.split(' ').map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()).join(" ");
    const exBlog=await Blog.findOne({title:theTitle})
    if(exBlog){
        return res.status(400).json({message:"Blog with this title already exists"})
    }
    const uploadResponse = await cloudNary.uploader.upload(image,{upload_preset: 'blog_images'})
    const newBlog=new Blog({
        title:theTitle,
        description:description,
        image:uploadResponse.public_id,
        userId
    })
    try{
        const result=await newBlog.save()
        existingUser.blogs.push(result._id)
        await existingUser.save()

    }catch(err){
        console.log(err);
        return res.status(500).json({message:err})
    }
    return res.status(200).json({message:"Blog added successfully"})
}

export const updateBlog = async (req, res) => {
    const {title,description}=req.body
    const blogId=req.query.id
        try {
        const blogExist=await Blog.findById(blogId)
        if(!blogExist){
            return res.status(404).json({message:"No Blog Found"})
        }
            await Blog.findByIdAndUpdate(blogId,{
                title,
                description
            },{new:true})
            res.status(200).json({message:"Blog updated successfully"})
        } catch (error) {
            console.log(error);
        }

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

export const deleteBlog = async (req, res) => {
    const blogId=req.query.id
    let blog;
    try{
        blog=await Blog.findById(blogId)
        if(!blog){
            return res.status(404).json({message:'No Blog Found'})
        }else{
            await Blog.findByIdAndDelete(blogId)
            await cloudNary.uploader.destroy(blog.image)
            await User.findByIdAndUpdate(blog.userId,{$pull:{blogs:blogId}})
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
        userBlogs=await User.findById({_id:userId, isDraft: false, isTrash: false }).select('blogs').populate('blogs').sort({createdAt:-1})
    }catch(err){
        return console.log(err);
    }
    if(!userBlogs){
        return res.status(404).json({message:"No Blogs Found"})
    }
    return res.status(200).json({data:userBlogs.blogs.reverse()})
}

export const saveToDraft=async(req,res)=>{
    const {title,description}=req.body
    const image=req.body.data
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
    // const theDesc=description.split(' ').map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()).join(" ");
    const theTitle=title.split(' ').map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()).join(" ");
    const exDraft=await Draft.findOne({title:theTitle})
    if(exDraft){
        return res.status(400).json({message:"Blog with this title already exists in the draft"})
    }
    const uploadResponse = await cloudNary.uploader.upload(image,{upload_preset: 'blog_images'})
    const newDraft=new Draft({
        title:theTitle,
        description:description,
        image:uploadResponse.public_id,
        userId
    })
    try{
        await newBlog.save()
    }catch(err){
        console.log(err);
        return res.status(500).json({message:err})
    }
    return res.status(200).json({message:"Blog added to Draft successfully"})
}

export const getDrafts=async(req,res)=>{
    const userId=req.user.id
    let drafts;
    try{
        drafts=await Draft.find({userId})
    }catch(err){
        return console.log(err);
    }
    if(!drafts){
        return res.status(404).json({message:"No Drafts Found"})
    }
    return res.status(200).json({data:drafts})
}

export const deleteDraft=async(req,res)=>{
    const draftId=req.query.id
    let draft;
    try{
        draft=await Draft.findById(draftId)
        if(!draft){
            return res.status(404).json({message:'No Draft Found'})
        }else{
            await Draft.findByIdAndDelete(draftId)
            await cloudNary.uploader.destroy(draft.image)
            return res.status(200).json({message:'Draft Successfully Deleted'})
        }
    }catch(err){
        console.log(err);
    }
}

export const getADraft=async(req,res)=>{
    const draftId=req.query.id
    let draft;
    try {
        draft=await Draft.findById(draftId)
    } catch (error) {
        console.log(error);
    }
    if(!draft){
        return res.status(404).json({message:"No Draft Found"})
    }else{
        return res.status(200).json({data:draft})
    }
}
export const updateDraft=async(req,res)=>{
    const {title,description}=req.body
    const draftId=req.query.id
    try {
    const draftExist=await Draft.findById(draftId)
    if(!draftExist){
        return res.status(404).json({message:"No Draft Found"})
    }
    await Draft.findByIdAndUpdate(draftId,{
        title,
        description
    },{new:true})
    res.status(200).json({message:"Draft updated successfully"})
    } catch (error) {
        console.log(error);
    }
}

export const publishDraft=async(req,res)=>{
    const draftId=req.query.id
    let draft;
    try {
        draft=await Draft.findById(draftId)
        if(!draft){
            return res.status(404).json({message:"No Draft Found"})
        }
        const newBlog=new Blog({
            title:draft.title,
            description:draft.description,
            image:draft.image,
            userId:draft.userId
        })
        const result=await newBlog.save()
        const theUser=await User.findById(draft.userId)
        theUser.blogs.push(result._id)
        await Draft.findByIdAndDelete(draftId)

    } catch (error) {
        console.log(error);
    }
}
