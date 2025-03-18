import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  secure: true,
  httpOnly: true,
};

const connectDB = (url) => {
  mongoose
    .connect(url, { dbName: "ChatApp" })
    .then((data) => {
      console.log(`Connected to DB: ${data.connection.host}`);
    })
    .catch((err) => {
      throw err;
    });
};

const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });


  return res.status(code).cookie("chatAppToken", token, cookieOptions).json({
    success: true,
    message,
  });
};

export { connectDB, sendToken };
