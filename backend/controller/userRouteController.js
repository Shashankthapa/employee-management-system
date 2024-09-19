import bcrypt from "bcrypt";
import u_model from "../models/user.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

export const createUser = async (req, res) => {
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

export const loginUser = async (req, res) => {
  //   console.log("file : " + JSON.stringify(req.file.filename));
  //   console.log("body : " + JSON.stringify(req.body));
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(423).json({ msg: result.array() });
  }
  const { username, password } = req.body;
  const user = await u_model.findOne({ username: username });
  if (!user) return res.status(404).json({ msg: "user not found" });
  const hash_pass = user.password;
  const isValidHash = await bcrypt.compare(password, hash_pass);
  if (!isValidHash) return res.status(404).json({ msg: "pass not match" });
  const token = jwt.sign({ username: username }, "xyz123");
  const oneDay = 1000 * 24 * 60 * 60;

  req.session.curr_user = username;
  req.session.save(() => {
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: false,
    });

    return res
      .status(200)
      .json({ name: `${username}`, msg: "Successfully logged in" });
  });
};
