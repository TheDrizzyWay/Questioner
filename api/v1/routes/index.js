import { Router } from 'express';
import authRoute from './authroute';
import userRoute from './userroute';
import meetupRoute from './meetuproute';

const router = new Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/meetups', meetupRoute);

export default router;
