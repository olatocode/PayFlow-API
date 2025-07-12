/** @format */

import User from '../models/user.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -__v');
    if (!users.length)
      return res.status(404).json({ message: 'No users found' });
    res.status(200).json({
      status: 'success',
      message: ' Users view successfully',
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v');
    if (!user) return res.status(404).json({ message: 'No user found' });
    res.status(200).json({
      status: 'success',
      message: 'User view successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: 'No user found' });
    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isDeleted) {
      return res.status(400).json({ message: 'User already deleted' });
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDeletedUsers = async (req, res) => {
  try {
    const count = await User.countDocuments({ isDeleted: true });
    console.log(count);
    res.status(200).json({ deletedUsers: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

