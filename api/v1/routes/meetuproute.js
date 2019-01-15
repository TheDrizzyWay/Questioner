import express from 'express';
import meetupsController from '../controllers/meetupscontroller';
import rsvpController from '../controllers/rsvpcontroller';
import MeetupValidation from '../middleware/meetupvalidation';
import RsvpValidation from '../middleware/rsvpvalidation';
import idValidation from '../middleware/idvalidation';
import { requireAuth, adminAuth } from '../middleware/authentication';
import tryCatch from '../utils/trycatch';

const {
  createMeetup, getAllMeetups, getMeetupById,
  updateMeetup, getUpcomingMeetups, deleteMeetup,
} = meetupsController;

const { joinMeetup } = rsvpController;

const router = express.Router();

router.post('/', requireAuth, adminAuth, MeetupValidation.validCreate,
  MeetupValidation.checkTags, MeetupValidation.checkDate, tryCatch(createMeetup));
router.get('/', requireAuth, tryCatch(getAllMeetups));
router.get('/upcoming', requireAuth, tryCatch(getUpcomingMeetups));
router.get('/:id', requireAuth, idValidation, tryCatch(getMeetupById));
router.put('/:id', requireAuth, adminAuth, idValidation,
  MeetupValidation.validEdit, MeetupValidation.checkTags,
  MeetupValidation.checkDateEdit, tryCatch(updateMeetup));
router.delete('/:id', requireAuth, adminAuth, idValidation, tryCatch(deleteMeetup));
router.post('/:id/rsvps', requireAuth, RsvpValidation.validRsvp, tryCatch(joinMeetup));

export default router;
