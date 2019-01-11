import { Router } from 'express';
import meetupRoute from './meetuproute';
import questionRoute from './questionroute';

const router = new Router();

router.use('/meetups', meetupRoute);
router.use('/questions', questionRoute);

export default router;
