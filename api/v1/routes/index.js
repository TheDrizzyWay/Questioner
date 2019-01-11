import { Router } from 'express';
import authRoute from './authroute';

const router = new Router();

router.use('/auth', authRoute);

export default router;
