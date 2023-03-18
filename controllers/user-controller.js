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