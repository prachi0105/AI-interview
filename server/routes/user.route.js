import express from "express";
const userRouter = express.Router();
import { getCurrentuser } from "../controllers/user.controller.js";
import  isAuth  from "../middlewares/isAuth.js";

userRouter.get("/current-user" , isAuth , getCurrentuser)


export default userRouter; 