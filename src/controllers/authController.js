/** @format */
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Wallet = require('../models/wallet');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/generateToken');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: 'Email already in use' });

    const user = new User({ name, email, password });
    await user.save();

    const wallet = new Wallet({ user: user._id });
    await wallet.save();

    user.wallet = wallet._id;

    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;

    await user.save();

    const accessToken = generateAccessToken(user._id);

    tokens = {
      accessToken,
      refreshToken,
    };

    res.status(201).json({
      message: 'Registration Successful',
      data: tokens,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).populate('wallet');
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();
    tokens = {
      accessToken,
      refreshToken,
    };

    res.status(200).json({ message: 'Login Successful', data: tokens });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ message: 'Refresh token required' });

  try {
    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(204).json({ message: 'Already logged out' });

    user.refreshToken = null;
    await user.save();

    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ message: 'Refresh token missing' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken)
      return res.status(403).json({ message: 'Invalid refresh token' });

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    res
      .status(200)
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(403).json({ message: 'Token expired or invalid' });
  }
};

module.exports = { register, login, logout, refreshAccessToken };
