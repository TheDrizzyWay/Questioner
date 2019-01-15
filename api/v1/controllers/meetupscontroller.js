import Meetup from '../models/Meetups';
import { successResponse, errorResponse } from '../utils/responses';

export default {
  createMeetup: async (req, res) => {
    const meetup = new Meetup(req.body);
    meetup.topic = meetup.topic.replace(/([^a-zA-z0-9\s])/g, '');
    meetup.location = meetup.location.replace(/([^a-zA-z\s])/g, '');

    const result = await meetup.createMeetup();

    return successResponse(res, 201, 'Meetup created successfully', result);
  },
};
