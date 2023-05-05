//import { json } from "body-parser";
import bcrypt, { hash } from "bcrypt";
import { User } from "../models/User.js";
import Jwt from "jsonwebtoken";
import cloudNary from "../utils/cloudinary.js";
import dotenv from "dotenv";
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
    const { name, email, password, blogs } = req.body
    const saltRound = 10;
    const exUser = await User.findOne({ email })
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please Fill All Fields' })
        } else if (!name) {
            return res.status(400).json({ message: 'Please Enter Your Name' })
        } else if (!email) {
            return res.status(400).json({ message: 'Please Enter Your Email' })
        } else if (!password) {
            return res.status(400).json({ message: 'Please Enter Your Password' })
        } else if (exUser) {
            return res.status(400).json({ message: 'User Already Exist! Login Instead' })
        } else {
            const theName = name.split(' ')
            const realName = theName.map((name) => name[0].toUpperCase() + name.slice(1).toLowerCase()).join(' ')
            bcrypt.hash(password, saltRound, (err, hash) => {
                const user = new User({
                    name: realName,
                    email: email.toLowerCase(),
                    password: hash,
                    blogs: []
                })
                user.save()
                return res.status(202).json({ message: 'User Created' })
            })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    let foundUser = await User.findOne({ email: email.toLowerCase() })
    if (!email) {
        return res.status(400).json({ message: 'Please Enter Your Email' })
    } else if (!password) {
        return res.status(400).json({ message: 'Please Enter Your Password' })
    } else if (foundUser) {
        bcrypt.compare(password, foundUser.password, (err, result) => {
            if (result) {
                try {
                    const token = Jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
                    res.header("auth-token", token).json({ message: "login successfully", token: token });
                } catch (error) {
                    return res.status(500).json({ message: error.message })
                }
            } else {
                return res.status(404).json({ message: 'Incorrect Password' })
            }
        })
    } else {
        return res.status(404).json({ message: 'Couldnt Find User By This Email' })
    }

}

export const verifyEmail = async (req, res) => {
    const { email } = req.body
    let user = await User.findOne({ email })
    if (!user) {
        return res.status(400).send('Invalid email')
    } else {
        try {
            // gelerate code
            const otpCode = nanoid(5).toUpperCase()
            // save to db
            user.otpCode = otpCode
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

            res.status(200).send('Email sent')
        } catch (error) {
            return res.status(400).send(error)
        }
    }

}