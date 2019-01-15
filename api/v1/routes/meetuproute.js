import express from 'express';
import meetupsController from '../controllers/meetupscontroller';
import MeetupValidation from '../middleware/meetupvalidation';
import idValidation from '../middleware/idvalidation';
import { requireAuth, adminAuth } from '../middleware/authentication';
import tryCatch from '../utils/trycatch';

const { createMeetup, getAllMeetups, getMeetupById } = meetupsController;

const router = express.Router();

router.post('/', requireAuth, adminAuth, MeetupValidation.validCreate,
  MeetupValidation.checkTags, MeetupValidation.checkDate, tryCatch(createMeetup));
router.get('/', requireAuth, tryCatch(getAllMeetups));
router.get('/:id', requireAuth, idValidation, tryCatch(getMeetupById));

export default router;
