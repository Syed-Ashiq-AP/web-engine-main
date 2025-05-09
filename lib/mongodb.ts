import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? "";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (e) {
    console.log(e);
  }
};

export default connectMongoDB;
