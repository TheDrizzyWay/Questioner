import { Router } from 'express';
import authRoute from './authroute';
import userRoute from './userroute';

const router = new Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);

export default router;
