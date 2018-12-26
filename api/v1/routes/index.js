import { Router } from 'express';
import meetupRoute from './meetuproute';
import appRoute from './approute';

const router = new Router();

router.use('/meetups', meetupRoute);
router.use('/*', appRoute);

export default router;
