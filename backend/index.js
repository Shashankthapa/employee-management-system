import express from "express";
import connect_mongo from "./database.js";
import u_model from "./models/user.js";
import bcrypt from "bcrypt";
import customError from "./util/customError.js";
import errorController from "./controller/errorController.js";
import cookieParser from "cookie-parser";
import asyncErrorMiddleware from "./util/asyncErrorHandler.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import { body } from "express-validator";
import multer from "multer";
import employee from "./models/employee.js";
import session from "express-session";
import fs from "fs";
import userRouter from "./routes/User.js";
import employeeRouter from "./routes/Employee.js";

const app = express();

connect_mongo();

app.use(express.static("uploads"));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/images");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// const loginValidator = [
// body("emp_username").notEmpty(),
// body("email").isEmail(),
// body("phoneno").isMobilePhone("en-IN"),
// ];

app.use("/api/user", userRouter);
app.use("/api/employee", upload.single("image"), employeeRouter);

// app.post(
//   "/create-emp",
// loginValidator
//   upload.single("image"),
//   asyncErrorMiddleware(async (req, res, next) => {
//     // const result = validationResult(req);
//     // if (!result.isEmpty()) {
//     //   res.status(423).json({ msg: result.array() });
//     //   return;
//     // }
//     // console.log("file : " + JSON.stringify(req.file.filename));
//     // console.log("body : " + JSON.stringify(req.body));
//     const { emp_username, email, occupation, gender, education, phoneno } =
//       req.body;
//     const { filename } = req.file;
//     console.log("Session user : " + req.session.curr_user);
//     const current_user = req.session.curr_user;
//     const token = req.cookies.token;
//     const decode = jwt.verify(token, "xyz123");
//     if (emp_username == current_user) {
//       res
//         .status(500)
//         .json({ msg: "current user name cannot be same as employee user" });
//     }
//     if (decode && current_user) {
//       const date = new Date();
//       const emp_data = await employee.create({
//         current_user: current_user,
//         emp_username: emp_username,
//         email: email,
//         occupation: occupation,
//         gender: gender,
//         education: education,
//         phoneno: phoneno,
//         create_date: date.toLocaleDateString(),
//         file: filename,
//       });
//       res.status(200).json({ res: emp_data });
//     } else {
//       res.status(404).json({
//         msg: "cannot access jwt error or current_user is not available",
//       });
//     }
//   })
// );

app.get("/get/:id", async (req, res) => {
  const { id } = req.params;
  const update_employee = await employee.find({ _id: id });
  res.status(200).json({ emp: update_employee });
});

app.post("/update/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { emp_username, email, occupation, gender, education, phoneno } =
    req.body;
  const { filename } = req.file;
  // console.log(id, req.file);
  // console.log("id : " + id, "req.body : " + req.body, "req.file : " + req.file);
  await employee.updateOne(
    { _id: id },
    {
      emp_username: emp_username,
      email: email,
      occupation: occupation,
      gender: gender,
      education: education,
      phoneno: phoneno,
      file: filename,
    }
  );
  res.status(200).json({ msg: "Updated employee" });
});

app.get("/display", async (req, res) => {
  const user_data = await employee.find({
    current_user: req.session.curr_user,
    // current_user: "shashank12",
  });
  res.status(200).json({ emp: user_data });
});

app.get("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const data = await employee.findOneAndDelete({ _id: id });
  fs.unlinkSync(`./uploads/images/${data.file}`);
  res.status(200).json({ msg: "data is deleted" });
});

app.all("*", (req, res, next) => {
  const error = new customError(
    `Something happened at ${req.originalUrl}`,
    400
  );
  next(error);
});

app.use(errorController);

app.listen(3000, () => {
  console.log("Listening to port 3000");
});
