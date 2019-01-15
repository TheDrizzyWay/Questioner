import express from 'express';
import usersController from '../controllers/userscontroller';
import UserValidation from '../middleware/uservalidation';
import { requireAuth } from '../middleware/authentication';
import tryCatch from '../utils/trycatch';

const { editUser } = usersController;

const router = express.Router();

router.put('/edit', requireAuth, UserValidation.validEdit, tryCatch(editUser));
// add route for get user profile

export default router;
