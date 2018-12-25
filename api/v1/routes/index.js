import { Router } from 'express';
import meetupRoute from './meetuproute';

const router = new Router();

router.use('/meetups', meetupRoute);

export default router;
