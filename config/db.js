import mongoose from "mongoose"
const dataBase = () => {
    try {
    // mongoose.set('strictQuery', false);
        mongoose.connect("mongodb://127.0.0.1/blogApp")
            .then(() => console.log("Connected to MongoDB 🫙"))
            .catch((err) => console.error(err));
    } catch (error) {
        console.log(error);
    }
}
export default dataBase