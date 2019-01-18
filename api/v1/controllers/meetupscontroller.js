import Meetup from '../models/Meetups';
import { successResponse, errorResponse } from '../utils/responses';

export default {
  /**
   * @description Creates a new meetup
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and meetup details
   */

  createMeetup: async (req, res) => {
    const meetup = new Meetup(req.body);
    meetup.topic = meetup.topic.replace(/([@#$%&<>=*/\\])/g, '').trim();
    meetup.location = meetup.location.replace(/([@#$%&<>*/\\\s])/g, '').trim();
    meetup.happeningon = meetup.happeningon.replace('T', ' by ').trim();

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

  /**
   * @description Gets a single meetup
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and a single meetup if it exists
   */

  getMeetupById: async (req, res) => {
    const { id } = req.params;
    const result = await Meetup.getMeetupById(id);

    if (!result) return errorResponse(res, 404, 'Meetup not found');
    return successResponse(res, 200, 'Meetup Found.', result);
  },

  /**
   * @description Updates the details of a meetup
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and new meetup details
   */

  updateMeetup: async (req, res) => {
    const { id } = req.params;
    const meetupExists = await Meetup.getMeetupById(id);
    if (!meetupExists) return errorResponse(res, 404, 'Meetup not found');

    const newMeetup = req.body;

    if (newMeetup.topic) newMeetup.topic = newMeetup.topic.replace(/([^a-zA-z0-9\s])/g, '');
    if (newMeetup.location) newMeetup.location = newMeetup.location.replace(/([^a-zA-z\s])/g, '');
    if (newMeetup.happeningon) newMeetup.happeningon = newMeetup.happeningon.replace('T', ' by ');

    meetupExists.topic = newMeetup.topic || meetupExists.topic;
    meetupExists.location = newMeetup.location || meetupExists.location;
    meetupExists.happeningon = newMeetup.happeningon || meetupExists.happeningon;
    meetupExists.image = newMeetup.image || meetupExists.image;
    meetupExists.tags = newMeetup.tags || meetupExists.tags;

    const result = await Meetup.updateMeetup(id, meetupExists);
    return successResponse(res, 200, 'Meetup updated successfully', result);
  },

  /**
   * @description Gets all upcoming meetups
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and all upcoming meetups
   */

  getUpcomingMeetups: async (req, res) => {
    const currentDate = new Date(Date.now());
    const result = await Meetup.getUpcomingMeetups(currentDate);

    if (result.length === 0) return successResponse(res, 200, 'No upcoming meetups found.', result);
    return successResponse(res, 200, 'Upcoming Meetups found.', result);
  },

  /**
   * @description Deletes a meetup
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code and message
   */

  deleteMeetup: async (req, res) => {
    const { id } = req.params;
    const meetupExists = await Meetup.getMeetupById(id);

    if (!meetupExists) return errorResponse(res, 404, 'Meetup not found.');
    await Meetup.deleteMeetup(id);
    return successResponse(res, 200, 'Meetup deleted successfully.', null);
  },
};
