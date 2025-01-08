import express from "express";
import "dotenv/config";
import { connectDb } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import postRoutes from "./src/routes/postRoutes.js";
import followRoutes from "./src/routes/followRoutes.js";
import likeRoutes from "./src/routes/likeRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

connectDb();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
