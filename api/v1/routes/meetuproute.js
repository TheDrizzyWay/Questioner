import express from 'express';
import meetupController from '../controllers/meetupcontroller';
import rsvpController from '../controllers/rsvpcontroller';
import MeetupValidation from '../middleware/validatemeetup';
import RsvpValidation from '../middleware/validatersvp';
import idValidator from '../middleware/idvalidator';

const {
  createMeetup, getOneMeetup, getAllMeetups, getUpcomingMeetups,
} = meetupController;
const { respond } = rsvpController;

const router = express.Router();

router.post('/', MeetupValidation.validMeetup, createMeetup);
router.post('/:id/rsvps', idValidator, RsvpValidation.validRsvp, respond);
router.get('/', getAllMeetups);
router.get('/upcoming', getUpcomingMeetups);
router.get('/:id', idValidator, getOneMeetup);

export default router;
