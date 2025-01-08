import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authorization required" });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decodedData?.id;

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
