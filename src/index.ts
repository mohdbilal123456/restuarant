import express from 'express'
import dotenv from 'dotenv'
import restaurantRoute from './routes/restaurant.route'
import morgan from "morgan"
import cookieParser from "cookie-parser";
import cors from 'cors'
import connectDb from './config/db';
import menuRouter from './routes/menu.route';
import cartRouter from './routes/cart.route';
dotenv.config()
const app = express()
app.use(morgan("dev"));

app.use(cookieParser());
const port = process.env.PORT || 6000

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://tomatofrontend-w08d.onrender.com"
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/restaurant",restaurantRoute)
app.use("/api/item",menuRouter)
app.use("/api/cart",cartRouter)


app.listen(port ,()=>{
  console.log(`Restaurant service is running at port ${port}`)
  connectDb()

})
