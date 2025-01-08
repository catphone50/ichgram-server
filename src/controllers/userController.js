import User from "../models/userModel.js";
import Follow from "../models/followModel.js";

export const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId)
      .select("-password")
      .populate("followersCount followingCount");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

export const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { fullName, email, username, description, avatar } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (username) user.username = username;
    if (description) user.description = description;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({ message: "Successfully updated profile", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};

export const followUser = async (req, res) => {
  const { followerId, followingId } = req.body;

  try {
    const existingFollow = await Follow.findOne({
      follower: followerId,
      following: followingId,
    });
    if (existingFollow) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    const newFollow = new Follow({
      follower: followerId,
      following: followingId,
    });

    await newFollow.save();

    res.status(200).json({ message: "Successfully followed user" });
  } catch (error) {
    res.status(500).json({ message: "Error following user", error });
  }
};

export const unfollowUser = async (req, res) => {
  const { followerId, followingId } = req.body;

  try {
    const follow = await Follow.findOne({
      follower: followerId,
      following: followingId,
    });
    if (!follow) {
      return res
        .status(400)
        .json({ message: "You are not following this user" });
    }

    await Follow.findByIdAndDelete(follow._id);

    res.status(200).json({ message: "Successfully unfollowed user" });
  } catch (error) {
    res.status(500).json({ message: "Error unfollowing user", error });
  }
};

export const getFollowers = async (req, res) => {
  const { userId } = req.params;

  try {
    const followers = await Follow.find({ following: userId }).populate(
      "follower",
      "username avatar"
    );
    res.status(200).json(followers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching followers", error });
  }
};

export const getFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
    const following = await Follow.find({ follower: userId }).populate(
      "following",
      "username avatar"
    );
    res.status(200).json(following);
  } catch (error) {
    res.status(500).json({ message: "Error fetching following", error });
  }
};
