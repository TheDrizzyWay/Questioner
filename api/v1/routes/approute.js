import express from 'express';
import appController from '../controllers/appcontroller';

const { welcome } = appController;

const router = express.Router();

router.get('/', welcome);

export default router;
