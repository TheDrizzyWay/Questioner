import express from 'express';
import meetupController from '../controllers/meetupcontroller';
import validateMeetup from '../middleware/validatemeetup';
import idValidator from '../middleware/idvalidator';

const { createMeetup, getOneMeetup } = meetupController;

const router = express.Router();

router.post('/', validateMeetup, createMeetup);
router.get('/:id', idValidator, getOneMeetup);

export default router;
