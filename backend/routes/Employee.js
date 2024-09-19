import express from "express"
import asyncErrorMiddleware from "../util/asyncErrorHandler.js";
import { createEmployee } from "../controller/employeeRouteController.js";
const employeeRouter = express.Router();

employeeRouter.post("/create", asyncErrorMiddleware(createEmployee));

export default employeeRouter;  