import express from 'express';
import usersController from '../controllers/userscontroller';
import UserValidation from '../middleware/uservalidation';
import { requireAuth, adminAuth } from '../middleware/authentication';
import tryCatch from '../utils/trycatch';

const { editUser, getAllUsers } = usersController;

const router = express.Router();

router.put('/', requireAuth, UserValidation.validEdit, tryCatch(editUser));
router.get('/', requireAuth, adminAuth, tryCatch(getAllUsers));
// add route for get user profile

export default router;
