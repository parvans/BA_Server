import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
const dataBase = () => {
    try {
    // mongoose.set('strictQuery', false);  
        mongoose.connect(`mongodb+srv://parvan:${process.env.MONGODB_URI_CLOUD}@cluster0.14wed.mongodb.net/?retryWrites=true&w=majority`)
            .then(() => console.log("Connected to MongoDB Cloud Atlas 🚀"))
            .catch((err) => console.error(err));
    } catch (error) {
        console.log(error);
    }
}
export default dataBase