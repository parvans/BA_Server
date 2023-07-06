import Chat from "../models/Chat.js"
import Message from "../models/Message.js"
import User from "../models/User.js"

export const sendMessage = async (req, res) => {
    const {chatId,cotent}=req.body
    if(!chatId||!cotent){
        return res.status(400).json({message:'All Fields Are Required'})
    } 
    var newMessage={
        sender:req.user.id,
        content:cotent,
        chat:chatId
    }
    try {
        var message=await Message.create(newMessage)
        message=await message.populate('sender','name email')
        message=await message.populate('chat')
        message=await User.populate(message,{
            path:'chat.users',
            select:'name email'
        })
        await Chat.findByIdAndUpdate(chatId,{latestMessage:message})
        return res.status(201).json({data:message})
    } catch (error) {
        return res.status(500).json({message:error})
    }
}
export const allMessage = async (req, res) => {
    const {chatId}=req.params
    try {
        const message=await Message.find({chat:chatId}).populate('sender','name email').populate('chat')
        return res.status(200).json({data:message})
    } catch (error) {
        return res.status(500).json({message:error})
    }
}