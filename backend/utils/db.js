import mongoose from "mongoose";



const connectDB = async () => {
     
    try {
        await mongoose.connect(process.env.MONGO_URL);
         ('mongodb connected successfully');
    } catch (error) {
       
         ("Failed to connect to mongodb");
         (error);
    }
}
export default connectDB;