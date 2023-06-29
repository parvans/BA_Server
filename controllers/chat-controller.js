import Chat from "../models/Chat.js"
import {User} from "../models/User.js"

export const accessthechat = async (req, res) => {
    const {userId}=req.body
    if(!userId) return res.status(400).json({message:'user id is required'})
    var isTheChat=await Chat.find({
        isGroupChat:false,$and:[
            {users:{$elemMatch:{$eq:req.user.id}}},
            {users:{$elemMatch:{$eq:userId}}}
        ]
    }).populate('users','-password').populate('latestMessage')
    isTheChat=await User.populate(isTheChat,
        {
            path:'latestMessage.sender',
            select:'name email',
        })
        
        if(isTheChat.length>0){
            return res.status(200).json({data:isTheChat[0]})
        }else{
            var chatData={
                chatName:'sender',
                isGroupChat:false,
                users:[req.user.id,userId],
            }
            try {
                const createTheChat=await Chat.create(chatData)
                const fullChat=await Chat.findOne({_id:createTheChat._id}).populate('users','-password')
                res.status(201).json({data:fullChat})
            } catch (error) {
                res.status(500).json({message:error.message})
            }
        }
}