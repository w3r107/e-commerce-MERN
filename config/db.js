import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Connected to MONGODB ${conn.connection.host} `.bgMagenta.white
    );
  } catch (error) {
    console.log(`Error in MONGODB ${error}`.bgRed.white);
  }
};

export default connectDB;
