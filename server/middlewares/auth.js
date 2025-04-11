import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/utility.js";
import { adminSecretKey } from "../app.js";

const isAuthenticated = (req, res, next) => {
  const token = req.cookies.chatAppToken;
  if (!token) {
    return next(new ErrorHandler("Please login to access this route", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decoded.id;
  next();
};

const adminOnly = (req, res, next) => {
  const token = req.cookies.chatAppAdminToken;
  if (!token) {
    return next(new ErrorHandler("Only Admin can access this route", 401));
  }

  const adminId = jwt.verify(token, process.env.JWT_SECRET);

  const isMatched = adminId === adminSecretKey;

  if (!isMatched) {
    return next(new ErrorHandler("Invalid Admin Key", 401));
  }

  next();
};

export { isAuthenticated , adminOnly};
