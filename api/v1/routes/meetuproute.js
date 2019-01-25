import express from 'express';
import MeetupsController from '../controllers/meetupscontroller';
import RsvpController from '../controllers/rsvpcontroller';
import MeetupValidation from '../middleware/meetupvalidation';
import RsvpValidation from '../middleware/rsvpvalidation';
import idValidation from '../middleware/idvalidation';
import { requireAuth, adminAuth } from '../middleware/authentication';
import tryCatch from '../utils/trycatch';

const {
  createMeetup, getAllMeetups, getMeetupById,
  updateMeetup, getUpcomingMeetups, deleteMeetup,
} = MeetupsController;
const {
  validCreate, checkTags, checkDate, validEdit, checkDateEdit,
} = MeetupValidation;

const { joinMeetup, getJoinedMeetups } = RsvpController;
const { validRsvp } = RsvpValidation;

const router = express.Router();

router.post('/', requireAuth, adminAuth, validCreate, checkTags, checkDate, tryCatch(createMeetup));
router.get('/', requireAuth, tryCatch(getAllMeetups));
router.get('/upcoming', requireAuth, tryCatch(getUpcomingMeetups));
router.get('/rsvps', requireAuth, tryCatch(getJoinedMeetups));
router.get('/:id', requireAuth, idValidation, tryCatch(getMeetupById));
router.put('/:id', requireAuth, adminAuth, idValidation, validEdit, checkTags, checkDateEdit, tryCatch(updateMeetup));
router.delete('/:id', requireAuth, adminAuth, idValidation, tryCatch(deleteMeetup));
router.post('/:id/rsvps', requireAuth, idValidation, validRsvp, tryCatch(joinMeetup));

export default router;
