import express from 'express';
import meetupController from '../controllers/meetupcontroller';
import rsvpController from '../controllers/rsvpcontroller';
import validateMeetup from '../middleware/validatemeetup';
import validateRsvp from '../middleware/validatersvp';
import idValidator from '../middleware/idvalidator';

const {
  createMeetup, getOneMeetup, getAllMeetups, getUpcomingMeetups,
} = meetupController;
const { respond } = rsvpController;

const router = express.Router();

router.post('/', validateMeetup, createMeetup);
router.post('/:id/rsvps', idValidator, validateRsvp, respond);
router.get('/', getAllMeetups);
router.get('/upcoming', getUpcomingMeetups);
router.get('/:id', idValidator, getOneMeetup);

export default router;
