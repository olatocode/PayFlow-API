/** @format */

import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = await User.findById(decoded.id).populate('wallet');
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired access token' });
  }
};

export default auth;
