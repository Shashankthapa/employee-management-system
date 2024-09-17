// user can be a employee but employee has to be a user to become an employee...
// import mongooseUniqueValidator from "mongoose-unique-validator";
import { Schema } from "mongoose";
import mongoose from "mongoose";

const user_model = Schema({
  username: {
    type: String,
    unique : true,
    required: [true, "username is required"],
  },
  email: {
    type: String,
    unique: true,
    require: [true, "email is required"],
  },
  password: {
    type: String,
    require: [true,"password is required"],
  },
});

// user_model.plugin(mongooseUniqueValidator);

const u_model = new mongoose.model("user_model", user_model);

export default u_model;