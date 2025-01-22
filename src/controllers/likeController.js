import Like from "../models/likeModel.js";
import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js";
import {
  createNotification,
  deleteNotification,
} from "./notificationController.js";
import User from "../models/userModel.js";

// Like Post
export const likePost = async (req, res) => {
  const { postId, userId, username, type } = req.body;

  if (!postId || !userId || !username || !type) {
    console.log("Missing postId, userId, username, or type");
    return res
      .status(400)
      .json({ message: "Missing postId, userId, username, or type" });
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      console.log("Post not found");
      return res.status(404).json({ message: "Post not found" });
    }

    const existingLike = await Like.findOne({ user: userId, post: postId });
    if (existingLike) {
      console.log("You already liked this post");
      return res.status(400).json({ message: "You already liked this post" });
    }

    const newLike = new Like({
      user: userId,
      post: postId,
    });

    await newLike.save();

    const likedPost = await Post.findById(postId).populate("author");

    const io = req.app.get("io");
    await createNotification(
      io,
      likedPost.author._id,
      userId,
      newLike._id,
      "Post",
      false,
      `${username} liked your post!`,
      type
    );

    // Обновляем массив лайков в посте
    post.likes.push(newLike._id);
    await post.save();

    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    console.error("Error liking post", error);
    res.status(500).json({ message: "Error liking post", error });
  }
};

// Unlike Post
export const unlikePost = async (req, res) => {
  const { postId, userId, username, type } = req.body;

  if (!postId || !userId || !username || !type) {
    console.log("Missing postId, userId, username, or type");
    return res.status(400).json({
      message: "Missing postId, userId, username, or type",
    });
  }

  try {
    const existingLike = await Like.findOne({ user: userId, post: postId });
    if (!existingLike) {
      console.log("You haven't liked this post");
      return res.status(400).json({ message: "You haven't liked this post" });
    }
    // Обновляем массив лайков в посте
    const post = await Post.findById(postId);
    if (post) {
      post.likes = post.likes.filter(
        (likeId) => likeId.toString() !== existingLike._id.toString()
      );

      await deleteNotification(
        post.author._id,
        userId,
        existingLike._id,
        "Post",
        `${username} liked your post!`,
        type
      );

      await Like.findByIdAndDelete(existingLike._id);

      await post.save();
    }

    console.log("Post unliked successfully");
    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    console.error("Error unliking post", error);
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

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
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

    const io = req.app.get("io");
    await createNotification(
      io,
      comment.user,
      userId,
      newLike._id,
      "Comment",
      false,
      `${user.username} liked your comment!`,
      `liked comment!`
    );

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

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await deleteNotification(
      comment.user,
      userId,
      existingLike._id,
      "Comment",
      `${user.username} liked your post!`,
      `liked comment!`
    );

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
