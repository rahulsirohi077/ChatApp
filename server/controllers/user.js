import { compare } from "bcrypt";
import { User } from "../models/user.js";
import { sendToken } from "../utils/features.js";

// create a new user and save it to the database and save in cookie
const newUser = async (req, res) => {

  const {name,username,password,bio} = req.body;
  
  console.log(req.body);

  const avatar = {
    public_id: "Sdfsd",
    url:"asdfd"
  }

  await User.create({
    name,
    bio,
    username,
    password,
    avatar,
  });

  sendToken(res,user,201,"User created successfully");
};

const login = async(req, res) => {

  const {username, password} = req.body;

  const user = await User.findOne({username}).select("+password");

  if(!user){
    return res.status(400).json({
      success: false,
      message: "Invalid Username",
    });
  }

  const isMatch = await compare(password, user.password);

  if(!isMatch){
    return res.status(400).json({
      success: false,
      message: "Invalid Password",
    });
  }
  sendToken(res,user,200,`Welcome back, ${user.name}`);
};

const getMyProfile = async(req, res) => {};

export { login, newUser, getMyProfile };
