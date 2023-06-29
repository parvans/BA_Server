import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
async function auth(req,res,next){
    const token=req.header('auth-token')
    if(!token) return res.status(403).json({message:'forbidden - token is unavailable'}) 
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded
        next(); 
    } catch (error) { 
        res.status(401).json({message:error.message})
    } 
}

export default auth;