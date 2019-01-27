import express from 'express';
import UsersController from '../controllers/userscontroller';
import UserValidation from '../middleware/uservalidation';
import { requireAuth, adminAuth } from '../middleware/authentication';
import tryCatch from '../utils/trycatch';

const { editUser, getAllUsers, getProfile } = UsersController;
const { validEdit } = UserValidation;

const router = express.Router();

router.put('/', requireAuth, validEdit, tryCatch(editUser));
router.get('/', requireAuth, adminAuth, tryCatch(getAllUsers));
router.get('/profile', requireAuth, tryCatch(getProfile));

export default router;
