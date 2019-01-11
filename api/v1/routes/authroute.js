import express from 'express';
import usersController from '../controllers/userscontroller';
import UserValidation from '../middleware/uservalidation';
import tryCatch from '../utils/trycatch';

const { signUp } = usersController;

const router = express.Router();

router.post('/signup', UserValidation.validSignUp, tryCatch(signUp));

export default router;
