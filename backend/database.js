import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connect_mongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to the database");
  } catch (err) {
    console.log("Error : " + err);
  }
};

export default connect_mongo;
