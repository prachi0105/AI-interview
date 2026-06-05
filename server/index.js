import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/connectDb.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import isAuth from './middlewares/isAuth.js';
import interviewRouter from './routes/interview.route.js';
import paymentRouter from './routes/payment.route.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use(cors({
  origin: "https://ai-interview-client-16m5.onrender.com",
  credentials: true
}))

app.use("/api/auth" , authRouter)
app.use("/api/user" , userRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/payment", paymentRouter);





const port = process.env.PORT || 6000;

app.listen(port , () =>{
    console.log("server running on port " + port)
    connectDb();
})


