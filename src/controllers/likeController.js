import Like from "../models/likeModel.js";
import Post from "../models/postModel.js";

export const likePost = async (req, res) => {
  const { userId, postId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingLike = await Like.findOne({ user: userId, post: postId });
    if (existingLike) {
      return res.status(400).json({ message: "You already liked this post" });
    }

    const newLike = new Like({
      user: userId,
      post: postId,
    });

    await newLike.save();

    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error liking post", error });
  }
};

export const unlikePost = async (req, res) => {
  const { userId, postId } = req.body;

  try {
    const existingLike = await Like.findOne({ user: userId, post: postId });
    if (!existingLike) {
      return res.status(400).json({ message: "You haven't liked this post" });
    }

    await Like.findByIdAndDelete(existingLike._id);

    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unliking post", error });
  }
};

export const getPostLikesCount = async (req, res) => {
  const { postId } = req.params;

  try {
    const likesCount = await Like.countDocuments({ post: postId });
    res.status(200).json({ likesCount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching likes count", error });
  }
};

export const getPostLikes = async (req, res) => {
  const { postId } = req.params;

  try {
    const likes = await Like.find({ post: postId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching likes", error });
  }
};
