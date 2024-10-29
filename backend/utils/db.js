import mongoose from "mongoose";



const connectDB = async () => {
     
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('mongodb connected successfully');
    } catch (error) {
       
        console.log("Failed to connect to mongodb");
        console.log(error);
    }
}
export default connectDB;