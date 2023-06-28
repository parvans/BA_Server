import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
const dataBase = () => {
    try {
    // mongoose.set('strictQuery', false);  
        mongoose.connect(process.env.MONGODB_URI_CLOUD)
            .then(() => console.log("Connected to MongoDB 🫙"))
            .catch((err) => console.error(err));
    } catch (error) {
        console.log(error);
    }
}
export default dataBase