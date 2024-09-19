import jwt from "jsonwebtoken";
import employee from "../models/employee.js";
import { validationResult } from "express-validator";

export const createEmployee = async (req, res) => {
  console.log("from emp route : " + JSON.stringify(req.file) + JSON.stringify(req.body))
  // console.log("file : " + JSON.stringify(req.file.filename));
  // console.log("body : " + JSON.stringify(req.body));
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(423).json({ msg: result.array() });
  }
  // const { emp_username, email, occupation, gender, education, phoneno } =
  //   req.body;
  // const { filename } = req.file;
  // console.log("Session user : " + req.session.curr_user);
  // const current_user = req.session.curr_user;
  // const token = req.cookies.token;
  // const decode = jwt.verify(token, "xyz123");
  // if (emp_username == current_user) {
  //   res
  //     .status(500)
  //     .json({ msg: "current user name cannot be same as employee user" });
  // }
  // if (decode && current_user) {
  //   const date = new Date();
  //   const emp_data = await employee.create({
  //     current_user: current_user,
  //     emp_username: emp_username,
  //     email: email,
  //     occupation: occupation,
  //     gender: gender,
  //     education: education,
  //     phoneno: phoneno,
  //     create_date: date.toLocaleDateString(),
  //     file: filename,
  //   });
  //   res.status(200).json({ res: emp_data });
  // } else {
  //   res.status(404).json({
  //     msg: "cannot access jwt error or current_user is not available",
  //   });
  // }
};
