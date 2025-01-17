import User from "../models/userModel.js";
import Follow from "../models/followModel.js";
import Post from "../models/postModel.js";

export const searchUsersWithPosts = async (req, res) => {
  const { query } = req.query;

  try {
    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const users = await User.find({
      username: { $regex: query, $options: "i" },
    })
      .select("-password")
      .lean();

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        try {
          const [followers, following, posts] = await Promise.all([
            Follow.find({ following: user._id })
              .populate("follower", "username avatar")
              .lean(),
            Follow.find({ follower: user._id })
              .populate("following", "username avatar")
              .lean(),
            Post.find({ author: user._id })
              .populate("author", "username avatar")
              .populate("likes")
              .populate({
                path: "comments",
                populate: [
                  { path: "likes" },
                  { path: "user", select: "username avatar" },
                ],
              })
              .sort({ createdAt: -1 })
              .lean(),
          ]);

          return {
            ...user,
            followers: followers.map((f) => f.follower),
            following: following.map((f) => f.following),
            posts,
          };
        } catch (error) {
          console.error("Error processing user details:", error);
          throw error;
        }
      })
    );

    res.status(200).json(usersWithDetails);
  } catch (error) {
    console.log("Error searching users with posts:", error); // Добавленный лог
    console.error("Error searching users with posts:", error);
    res.status(500).json({ message: "Error searching users", error });
  }
};
