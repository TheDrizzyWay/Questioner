import Meetup from '../models/Meetups';
import { successResponse } from '../utils/responses';

export default {
  /**
   * @description Creates a new meetup
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and meetup details
   */

  createMeetup: async (req, res) => {
    const meetup = new Meetup(req.body);
    meetup.topic = meetup.topic.replace(/([^a-zA-z0-9\s])/g, '');
    meetup.location = meetup.location.replace(/([^a-zA-z\s])/g, '');
    meetup.happeningon = meetup.happeningon.replace('T', ' by ');

    const result = await meetup.createMeetup();

    return successResponse(res, 201, 'Meetup created successfully', result);
  },

  /**
   * @description Gets all meetups
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and a list of all meetups if any
   */

  getAllMeetups: async (req, res) => {
    const result = await Meetup.getAllMeetups();

    if (result.length === 0) return successResponse(res, 200, 'No meetups found.', result);
    return successResponse(res, 200, 'Meetups found.', result);
  },
};
