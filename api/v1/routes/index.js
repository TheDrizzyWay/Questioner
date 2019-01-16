import { Router } from 'express';
import authRoute from './authroute';
import userRoute from './userroute';
import meetupRoute from './meetuproute';
import questionRoute from './questionroute';
import commentRoute from './commentroute';

const router = new Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/meetups', meetupRoute);
router.use('/questions', questionRoute);
router.use('/comments', commentRoute);

export default router;
