import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import nodemailer from "nodemailer";
import { firstNameSecondNameCapForReg, isEmail, isEmpty, isNull, ReE, ReS, too } from "../services/util.service.js";
import HttpStatus from "http-status"
import  isValidObjectId from "mongoose";
dotenv.config();

export const getallUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password')
        return res.status(200).json({ data: users })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const signup = async (req, res) => {
    let err;
    const body = req.body;
    const validation = ["name", "email", "password"];

    let inVaild = await validation.filter((x) => {
        if (isNull(body[x])) {
          return true;
        }
        return false;
    });

    

    if (inVaild.length > 0) {
        return ReE(
          res,
          { message: `Please enter vaild details ${inVaild}` },
          HttpStatus.BAD_REQUEST
        );
    }
    
    if (String(body.name).trim().length < 3) {
        return ReE(
          res,
          { message: "Please enter name with more than 3 characters!." },
          HttpStatus.BAD_REQUEST
        );
    }

    if (String(body.name).trim().length > 18) {
        return ReE(
          res,
          { message: "Please enter name with maximum 18 characters!." },
          HttpStatus.BAD_REQUEST
        );
    }

    if (!(await isEmail(body.email))) {
        return ReE(
          res,
          { message: "Please enter vaild email !." },
          HttpStatus.BAD_REQUEST
        );
    }
    
    let checkUser;
    [err,checkUser]=await too(User.findOne({email:body.email}));

    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if(!isNull(checkUser)){
        return ReE(res,{ message: "Email id already taken!." },HttpStatus.BAD_REQUEST);
    }

    if (String(body.password).trim().length < 3) {
        return ReE(
          res,
          { message: "Please enter password with more the 3 characters!." },
          HttpStatus.BAD_REQUEST
        );
    }

    if (String(body.password).trim().length > 18) {
        return ReE(
          res,
          { message: "Please enter password with maximum 18 characters!." },
          HttpStatus.BAD_REQUEST
        );
    }
    let hashPassword;
    [err, hashPassword] = await too(bcrypt.hash(body.password, bcrypt.genSaltSync(10)));

    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (isNull(hashPassword)) {
        return ReE(
        res,
        { message: "Something went wrong with password!." },
        HttpStatus.BAD_REQUEST
        );
    }

    const createUser=new User({
        name:firstNameSecondNameCapForReg(body.name),
        email:body.email,
        password:hashPassword
    }).save();

    if (!isNull(createUser)) {
        return ReS(res,{ message: "User Register Successfully"},HttpStatus.OK);
    }
}

export const login = async (req, res) => {
    let err;
    const body=req.body;
    const fields = ["email", "password"];
    
    let inVaildFields = fields.filter(x => isNull(body[x]));

    if(!isEmpty(inVaildFields)){
        return ReE(res,{ message: `Please enter required fields ${inVaildFields}!.` }, HttpStatus.BAD_REQUEST);
    }
    body.email = String(body.email).toLowerCase();
    const {email,password} = body;


    let checkUser;
    [err,checkUser]=await too(User.findOne({email:email}));

    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    if (isNull(checkUser)) {
        return ReE(res,{ message: "User does not exit." },HttpStatus.BAD_REQUEST);
    }

    let checkPassword;
    [err, checkPassword] = await too(bcrypt.compare(password,checkUser.password));

    if (err) {
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!checkPassword) {
        return ReE(
          res,
          { message: "Please check your user name and password!." },
          HttpStatus.BAD_REQUEST
        );
    }

    let token = Jwt.sign({id:checkUser._id},process.env.JWT_SECRET,{expiresIn:'6h'});

    if(isNull(token)){
        return ReE(res, { message: "Something went wrong to genrate token!." }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    

    return ReS(res, { message: `Welcome ${checkUser.name}`, token: token,id:checkUser._id}, HttpStatus.OK);



    // let foundUser = await User.findOne({ email: email.toLowerCase() })
    // if (!email) {
    //     return res.status(400).json({ message: 'Please Enter Your Email' })
    // } else if (!password) {
    //     return res.status(400).json({ message: 'Please Enter Your Password' })
    // } else if (foundUser) {
    //     bcrypt.compare(password, foundUser.password, (err, result) => {
    //         if (result) {
    //             try {
    //                 const token = Jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, { expiresIn: '6h' })
    //                 res.header("auth-token", token).json({ message: "login successfully", token: token });
    //             } catch (error) {
    //                 return res.status(500).json({ message: error.message })
    //             }
    //         } else {
    //             return res.status(404).json({ message: 'Incorrect Password' })
    //         }
    //     })
    // } else {
    //     return res.status(404).json({ message: "Couldn't Find User By This Email" })
    // }

}

export const getUserProfile = async (req, res) => {
    let err;
    let user = req.user.id;
    if(isNull(user)){
        return ReE(res, { message: "Something went wrong" }, HttpStatus.BAD_REQUEST);
    }

    // if(!isValidObjectId(user)){
    //     return ReE(res, { message: "Something went wrong" }, HttpStatus.BAD_REQUEST);
    // }

    let getUser;

    [err, getUser] = await too(User.findById(user).select('-password'));

    if(err){
        return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if(isNull(getUser)){
        return ReE(res, { message: "User does not exist!." }, HttpStatus.BAD_REQUEST);
    }

    return ReS(res,{message:'User profile',data:getUser},HttpStatus.OK)

    
}

export const verifyEmail = async (req, res) => {
    const { email } = req.body
    let user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({ message: "User with this email does not exist" })
    } else {
        try {
            // gelerate code
            const otpCode = nanoid(5).toUpperCase()
            // save to db
            // if(user.otpCode){
            user.otp = otpCode
            // }else{
            //     const us=await User.updateOne({email},{$set:{otpCode}})
            //     us.otpCode=otpCode
            // }
            await user.save()

            // send email by using nodemailer

            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                // port: 993,
                secure: false,
                auth: {
                    // type:"login",
                    user: "parvansajeevan666@gmail.com",
                    pass: "ksjwpghjpcqjvmwq"
                }

            });

            const mailOption = {
                from: "parvansajeevan666@gmail.com",
                to: email,
                subject: "Password Reset mail ⚒️",
                text: `Your OTP is : ${otpCode}`,
                // html: "Hello worlds"
            }
            transporter.sendMail(mailOption, (error, info) => {
                if (error) {
                    console.log(error)
                } else {
                    console.log(info)
                }
            });

            res.status(200).json({ message: "Email sent successfully" })
        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    }

}

export const verifyCode = async (req, res) => {
    const {email,otp} = req.body
    let user=await User.findOne({email})
    if(!user){
        return res.status(400).json({message:"Invalid Email"})
    }else{
        try {
            if(user.otp===otp){
                return res.status(200).json({message:"OTP Verified"})
            }else{
                return res.status(400).json({message:"Invalid OTP"})
            }
        } catch (error) {
            return res.status(400).json({message:error.message})
        }
    }
}

export const resetPassword = async (req, res) => {
    const {email,password} = req.body
    let user=await User.findOne({email})
    if(!user){
        return res.status(400).json({message:"Invalid Email"})
    }else{
        const saltRound = 10;
        bcrypt.hash(password, saltRound, (err, hash) => {
            user.password=hash
            user.save()
            return res.status(200).json({message:"Password Changed"})
        })

    }
}

export const getOtherUsers = async (req, res) => {
    const keyword = req.query.search
    ? {
        $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
        ]
    }: {};

    try {
        const findUser = await User.find(keyword).find({ _id: { $ne: req.user.id } }).select('-password')
        return res.status(200).json({ data: findUser })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}



