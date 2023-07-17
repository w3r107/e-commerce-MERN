import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//here we will authenticate the user...
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UNAUTHORISED ACCESS",
      });
    } else {
      next();
    }
  } catch (e) {
    res.status(500).send({
      success: false,
      message: "error in admin middleware",
    });
    console.log(e);
  }
};
