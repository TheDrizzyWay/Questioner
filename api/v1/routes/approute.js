import express from 'express';
import appController from '../controllers/appcontroller';

const { getUndefined } = appController;

const router = express.Router();

router.get('/', getUndefined);

export default router;
