import Like from "../models/likeModel.js";
import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js";

// Like Post
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

// Unlike Post
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

// Get Post Likes Count
export const getPostLikesCount = async (req, res) => {
  const { postId } = req.params;

  try {
    const likesCount = await Like.countDocuments({ post: postId });
    res.status(200).json({ likesCount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching likes count", error });
  }
};

// Get Post Likes
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

// Like Comment
export const likeComment = async (req, res) => {
  const { userId, commentId } = req.body;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const existingLike = await Like.findOne({
      user: userId,
      comment: commentId,
    });
    if (existingLike) {
      return res
        .status(400)
        .json({ message: "You already liked this comment" });
    }

    const newLike = new Like({
      user: userId,
      comment: commentId,
    });

    await newLike.save();

    res.status(200).json({ message: "Comment liked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error liking comment", error });
  }
};

// Unlike Comment
export const unlikeComment = async (req, res) => {
  const { userId, commentId } = req.body;

  try {
    const existingLike = await Like.findOne({
      user: userId,
      comment: commentId,
    });
    if (!existingLike) {
      return res
        .status(400)
        .json({ message: "You haven't liked this comment" });
    }

    await Like.findByIdAndDelete(existingLike._id);

    res.status(200).json({ message: "Comment unliked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unliking comment", error });
  }
};

// Get Comment Likes Count
export const getCommentLikesCount = async (req, res) => {
  const { commentId } = req.params;

  try {
    const likesCount = await Like.countDocuments({ comment: commentId });
    res.status(200).json({ likesCount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching likes count", error });
  }
};

// Get Comment Likes
export const getCommentLikes = async (req, res) => {
  const { commentId } = req.params;

  try {
    const likes = await Like.find({ comment: commentId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching likes", error });
  }
};
