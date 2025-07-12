/** @format */

import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getDeletedUsers,
} from '../controllers/userController.js';
import express from 'express';
const router = express.Router();

router.get('/', getAllUsers);
router.get('/deleted', getDeletedUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
