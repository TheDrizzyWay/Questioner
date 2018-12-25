import express from 'express';
import meetupController from '../controllers/meetupcontroller';
import validateMeetup from '../middleware/validatemeetup';

const { createMeetup } = meetupController;

const router = express.Router();

router.post('/', validateMeetup, createMeetup);

export default router;
