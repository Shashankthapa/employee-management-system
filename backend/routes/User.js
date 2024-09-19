import express from "express"
import { createUser, loginUser } from "../controller/userRouteController.js";
import asyncErrorMiddleware from "../util/asyncErrorHandler.js";
const userRouter = express.Router();

//user routes
userRouter.post("/create", asyncErrorMiddleware(createUser));
userRouter.post("/login", asyncErrorMiddleware(loginUser))

export default userRouter;