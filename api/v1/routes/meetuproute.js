import express from 'express';
import meetupsController from '../controllers/meetupscontroller';
import MeetupValidation from '../middleware/meetupvalidation';
import idValidation from '../middleware/idvalidation';
import { requireAuth, adminAuth } from '../middleware/authentication';
import tryCatch from '../utils/trycatch';

const {
  createMeetup, getAllMeetups, getMeetupById,
  updateMeetup, getUpcomingMeetups,
} = meetupsController;

const router = express.Router();

router.post('/', requireAuth, adminAuth, MeetupValidation.validCreate,
  MeetupValidation.checkTags, MeetupValidation.checkDate, tryCatch(createMeetup));
router.get('/', requireAuth, tryCatch(getAllMeetups));
router.get('/upcoming', requireAuth, tryCatch(getUpcomingMeetups));
router.get('/:id', requireAuth, idValidation, tryCatch(getMeetupById));
router.put('/:id', requireAuth, adminAuth, idValidation,
  MeetupValidation.validEdit, MeetupValidation.checkTags,
  MeetupValidation.checkDateEdit, tryCatch(updateMeetup));

export default router;
