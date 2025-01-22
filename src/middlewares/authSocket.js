import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const authenticateSocket = async (socket, next) => {
  const token = socket.handshake.query.token;

  if (!token) {
    return next(new Error("Access denied! Token wans't provided"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new Error("User is not found"));
    }

    socket.user = user;

    next();
  } catch (error) {
    return next(new Error("Token is not valid"));
  }
};
