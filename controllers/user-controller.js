//import { json } from "body-parser";
import bcrypt, { hash } from "bcrypt";
import { User } from "../models/User.js";
import Jwt from "jsonwebtoken";
import cloudNary from "../utils/cloudinary.js";
const saltRound = 10;

export default {
    getallUsers: async (req, res, next) => {
        let users;
        try {
            users = await User.find()
        } catch (err) {
            console.log(err);
        }
        if (!users) {
            return res.status(404).json({ message: 'No Users Found' })
        } else {
            return res.status(200).json({ users })
        }
    },
    signup: async (req, res, next) => {
        const { image, name, email, password, blogs } = req.body
        let existingUser
        try {
            existingUser = await User.findOne({ email })
        } catch (err) {
            console.log(err);
        }
        if (existingUser) {
            return res.status(400).json({ message: 'User Already Exist! Login Instead' })
        } else {
            // cloudinary
            const uploadedResponse = await cloudNary.uploader.upload(image, {
                upload_preset: 'blog_images'
            })
            bcrypt.hash(password, saltRound, (err, hash) => {
                const user = new User({
                    image: uploadedResponse.public_id,
                    name,
                    email,
                    password: hash,
                    blogs: []
                })
                try {
                    user.save();
                } catch (err) {
                    console.log(err);
                }
                return res.status(202).json({ user })

            })
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body
        let existingUser
        try {
            existingUser = await User.findOne({ email })
        } catch (err) {
            console.log(err);
        }
        if (!existingUser) {
            return res.status(404).json({ message: 'Couldnt Find User By This Email' })
        } else {
            bcrypt.compare(password, existingUser.password, (err, result) => {
                if (result) {

                    return res.status(200).json({ message: "Login Successfull", user: { existingUser } })
                } else {
                    return res.status(404).json({ message: 'Incorrect Password' })
                }
            })
        }
    }
}