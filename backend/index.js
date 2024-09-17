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
// import { body, validationResult } from "express-validator";
import multer from "multer";
import employee from "./models/employee.js";
import session from "express-session";
import fs from "fs";

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
//   body("username").not().isEmpty(),
//   body("email").isEmail(),
//   body("phoneno").isMobilePhone("en-IN"),
// ];

const createPost = async (req, res) => {
  const { username, email, password } = req.body;
  const hash_pass = await bcrypt.hash(password, 13);
  const data = await u_model.create({
    username: username,
    email: email,
    password: hash_pass,
  });

  // create jwt with secret key and ttl
  const token = jwt.sign({ username: username, email: email }, "xyz123");
  const oneDay = 1000 * 24 * 60 * 60;
  console.log("Token jwt : " + token);

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: false,
  });

  data
    ? res.json({
        msg: `Added the data successfully`,
        username: data.username,
      })
    : res.json({ msg: `Data is not added` });
};

app.post("/create", asyncErrorMiddleware(createPost));

app.post(
  "/login",
  asyncErrorMiddleware(async (req, res) => {
    const { username, password } = req.body;
    const user = await u_model.findOne({ username: username });
    if (!user) return res.status(404).json({ msg: "user not found" });
    // console.log(user);
    const hash_pass = user.password;
    const isValidHash = await bcrypt.compare(password, hash_pass);
    if (!isValidHash) return res.status(404).json({ msg: "pass not match" });
    const token = jwt.sign({ username: username }, "xyz123");
    const oneDay = 1000 * 24 * 60 * 60;
    // console.log("Token jwt : " + token);

    req.session.curr_user = username;
    req.session.save(() => {
      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: false,
      });

      return res.status(200).json({ name: `${username}` });
    });
  })
);

app.post(
  "/create-emp",
  // loginValidator,
  upload.single("image"),
  asyncErrorMiddleware(async (req, res, next) => {
    // const result = validationResult(req);
    // if (!result.isEmpty()) {
    //   res.status(423).json({ msg: result.array() });
    //   return;
    // }
    // console.log("file : " + JSON.stringify(req.file.filename));
    // console.log("body : " + JSON.stringify(req.body));
    const { emp_username, email, occupation, gender, education, phoneno } =
      req.body;
    const { filename } = req.file;
    console.log("Session user : " + req.session.curr_user);
    const current_user = req.session.curr_user;
    const token = req.cookies.token;
    const decode = jwt.verify(token, "xyz123");
    if (emp_username == current_user) {
      res
        .status(500)
        .json({ msg: "current user name cannot be same as employee user" });
    }
    if (decode && current_user) {
      const date = new Date();
      const emp_data = await employee.create({
        current_user: current_user,
        emp_username: emp_username,
        email: email,
        occupation: occupation,
        gender: gender,
        education: education,
        phoneno: phoneno,
        create_date: date.toLocaleDateString(),
        file: filename,
      });
      res.status(200).json({ res: emp_data });
    } else {
      res.status(404).json({
        msg: "cannot access jwt error or current_user is not available",
      });
    }
  })
);

app.get("/getemployee/:id", async (req, res) => {
  const { id } = req.params;
  const update_employee = await employee.find({ _id: id });
  res.status(200).json({ emp: update_employee });
});

app.post("/updateemployee/:id", async (req, res) => {
  const { id } = req.params;
  // console.log(id, req.body);
  await employee.updateOne({ _id: id }, req.body);
  res.status(200).json({ msg: "Updated employee" });
});

app.get("/show-employee", async (req, res) => {
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
