import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Like from "../models/likeModel.js";
import Comment from "../models/commentModel.js";

// Create Post
export const createPost = async (req, res) => {
  const { description, image } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPost = new Post({
      description,
      image,
      author: userId,
    });

    await newPost.save();

    await createNotification(req.user._id, "You have created a new post!");

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Error creating post", error });
  }
};

// Get All Posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username avatar")
      .populate("likes")
      .populate({
        path: "comments",
        populate: [
          { path: "likes" },
          { path: "user", select: "username avatar" },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

// Get Posts By Limit
export const getPostsByLimit = async (req, res) => {
  const limit = parseInt(req.params.limit, 10);

  try {
    const posts = await Post.find()
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
      .limit(limit);

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

// Get Posts By Likes Limit
export const getPostsByLikesAndLimit = async (req, res) => {
  const start = parseInt(req.params.start, 10);
  const end = parseInt(req.params.end, 10);

  if (start < 1 || end < start) {
    return res.status(400).json({
      message:
        "Недопустимые параметры. Убедитесь, что start >= 1 и end >= start.",
    });
  }

  const limit = end - start + 1;

  try {
    const posts = await Post.find()
      .populate("author", "username avatar")
      .populate("likes")
      .populate({
        path: "comments",
        populate: [
          { path: "likes" },
          { path: "user", select: "username avatar" },
        ],
      })
      .sort({ likes: -1 })
      .skip(start - 1)
      .limit(limit);

    res.status(200).json(posts);
  } catch (error) {
    console.error("Ошибка при получении постов:", error);
    res.status(500).json({ message: "Ошибка при получении постов", error });
  }
};

// Get User Posts
export const getUserPosts = async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = await Post.find({ author: userId })
      .populate("author", "username avatar")
      .populate("likes")
      .populate({
        path: "comments",
        populate: [
          { path: "likes" },
          { path: "user", select: "username avatar" },
        ],
      })
      .sort({ createdAt: -1 });

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user posts", error });
  }
};

// Delete Post
export const deletePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not the author of this post" });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
};

// Get Post By Id
export const getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId)
      .populate("author", "username avatar")
      .populate("likes")
      .populate({
        path: "comments",
        populate: [
          { path: "likes" },
          { path: "user", select: "username avatar" },
        ],
      })
      .sort({ createdAt: -1 });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
};
