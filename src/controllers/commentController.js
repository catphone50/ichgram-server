import Comment from "../models/commentModel.js";
import Post from "../models/postModel.js";

export const addComment = async (req, res) => {
  const { userId, postId, text } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = new Comment({
      user: userId,
      post: postId,
      text,
    });

    await newComment.save();

    post.comments.push(newComment._id);
    await post.save();

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
  }
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const { userId } = req.body;

  try {
    const comment = await Comment.findById(commentId).populate("user", "_id");
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user._id.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own comments" });
    }

    await Comment.findByIdAndDelete(commentId);

    const post = await Post.findById(comment.post);
    post.comments.pull(commentId);
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
  }
};

export const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ post: postId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comments", error });
  }
};

export const getCommentById = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId).populate(
      "user",
      "username avatar"
    );
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching comment", error });
  }
};
