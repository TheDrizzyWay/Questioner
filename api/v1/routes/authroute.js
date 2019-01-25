import express from 'express';
import UsersController from '../controllers/userscontroller';
import UserValidation from '../middleware/uservalidation';
import tryCatch from '../utils/trycatch';

const { signUp, logIn } = UsersController;
const { validSignUp, validLogin } = UserValidation;

const router = express.Router();

router.post('/signup', validSignUp, tryCatch(signUp));
router.post('/login', validLogin, tryCatch(logIn));

export default router;
