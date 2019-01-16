import Rsvp from '../models/Rsvps';
import Meetup from '../models/Meetups';
import { successResponse, errorResponse } from '../utils/responses';

export default {
  joinMeetup: async (req, res) => {
    const meetupId = req.params.id;
    const userId = req.user.id;
    const userResponse = req.body.response;

    const meetupExists = await Meetup.getMeetupById(meetupId);
    if (!meetupExists) return errorResponse(res, 404, 'Meetup not found.');

    const alreadyResponded = await Rsvp.getUserByRsvp(meetupId, userId);
    if (alreadyResponded) return errorResponse(res, 400, 'You have already responded to this meetup.');

    const response = new Rsvp(req.body);
    const result = await response.joinMeetup(meetupId, userId);
    if (userResponse === 'yes') {
      return successResponse(res, 200, `You have joined ${meetupExists.topic}.`, result);
    }
    return successResponse(res, 200, 'Response recorded.', result);
  },

  getJoinedMeetups: async (req, res) => {
    const { id } = req.user;
    const response = 'yes';

    const result = await Rsvp.getJoinedMeetups(id, response);
    if (result.length === 0) return successResponse(res, 200, 'You have not joined any meetups yet.', result);
    return successResponse(res, 200, 'Joined meetups found.', result);
  },
};
