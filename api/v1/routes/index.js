import { Router } from 'express';
import meetupRoute from './meetuproute';

const router = new Router();

router.use('/meetups', meetupRoute);

router.get('/*', (req, res) => {
  res.status(404).send({ message: 'Invalid request.' });
});

export default router;
