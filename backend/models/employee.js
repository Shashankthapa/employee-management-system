import mongoose from "mongoose";
import { Schema } from "mongoose";
import u_model from "./user.js";

const employeeSchema = Schema({
  current_user : {
    type : String,
    ref : u_model
  },
  emp_username :{
    type : String,
    unique : true,
    required : [true, "pl enter valid username"]
  }, 
  create_date : String,
  email: String,
  occupation: String,
  gender: String,
  education: String,
  phoneno: String,
  file : String,
});

const employee = new mongoose.model("employeeSchema", employeeSchema);

export default employee;
