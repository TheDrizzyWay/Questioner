import { Router } from 'express';
import meetupRoute from './meetuproute';
import questionRoute from './questionroute';
import appRoute from './approute';

const router = new Router();

router.use('/meetups', meetupRoute);
router.use('/questions', questionRoute);
router.use('/', appRoute);

export default router;
