//if in package.json file "type":"module" below main...
//   then we have to use import  express from 'express'
import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import productRoute from "./routes/productRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import cors from "cors";

const app = express();

dotenv.config();
//database config
connectDB();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes...
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/category", categoryRoute);

//if not in root folder config({path:''})
app.get("/", (req, res) => {
  res.send({ msg: "hey" });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server up and running on ${PORT}`.bgCyan.white);
});
