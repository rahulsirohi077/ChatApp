import express from "express";
import userRouter from "./routes/user.js";
import { connectDB} from "./utils/features.js";
import dotenv from "dotenv";


const app = express();

app.use(express.json());

dotenv.config({
  path: "./.env"
});

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

connectDB(mongoURI);

app.use("/user", userRouter)

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
