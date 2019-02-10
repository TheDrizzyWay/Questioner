import Meetup from '../models/Meetups';
import Rsvp from '../models/Rsvps';
import { successResponse, errorResponse } from '../utils/responses';
import { sanitizer } from '../utils/stringfunctions';

export default class MeetupsController {
  /**
   * @description Creates a new meetup
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and meetup details
   */

  static async createMeetup(req, res) {
    if (req.file) req.body.image = req.file.url;
    const meetup = new Meetup(req.body);
    meetup.topic = sanitizer(meetup.topic);
    meetup.location = sanitizer(meetup.location);
    meetup.happeningon = meetup.happeningon.replace('T', ' by ').trim();

    const result = await meetup.createMeetup();
    return successResponse(res, 201, 'Meetup created successfully', result);
  }

  /**
   * @description Gets all meetups
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and a list of all meetups if any
   */

  static async getAllMeetups(req, res) {
    const result = await Meetup.getAllMeetups();

    if (result.length === 0) return successResponse(res, 200, 'No meetups found.', []);
    return successResponse(res, 200, 'Meetups found.', result);
  }

  /**
   * @description Gets a single meetup
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and a single meetup if it exists
   */

  static async getMeetupById(req, res) {
    const { id } = req.params;
    const result = await Meetup.getMeetupById(id);
    const joinedUsers = await Rsvp.getJoinedUsers(id);

    if (!result) return errorResponse(res, 404, 'Meetup not found');
    result.joinedUsers = joinedUsers.count;
    return successResponse(res, 200, 'Meetup Found.', result);
  }

  /**
   * @description Updates the details of a meetup
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and new meetup details
   */

  static async updateMeetup(req, res) {
    const { id } = req.params;
    const meetupExists = await Meetup.getMeetupById(id);
    if (!meetupExists) return errorResponse(res, 404, 'Meetup not found');

    const newMeetup = req.body;

    if (newMeetup.topic) newMeetup.topic = sanitizer(newMeetup.topic);
    if (newMeetup.location) newMeetup.location = sanitizer(newMeetup.location);
    if (newMeetup.happeningon) newMeetup.happeningon = newMeetup.happeningon.replace('T', ' by ');

    meetupExists.topic = newMeetup.topic || meetupExists.topic;
    meetupExists.location = newMeetup.location || meetupExists.location;
    meetupExists.happeningon = newMeetup.happeningon || meetupExists.happeningon;
    meetupExists.image = newMeetup.image || meetupExists.image;
    meetupExists.tags = newMeetup.tags || meetupExists.tags;

    const result = await Meetup.updateMeetup(id, meetupExists);
    return successResponse(res, 200, 'Meetup updated successfully', result);
  }

  /**
   * @description Gets all upcoming meetups
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and all upcoming meetups
   */

  static async getUpcomingMeetups(req, res) {
    const currentDate = new Date(Date.now());
    const { id } = req.user;
    const result = await Meetup.getUpcomingMeetups(currentDate);
    const getResponses = await Rsvp.getAllUserResponses(id);

    if (getResponses.length > 0) {
      getResponses.forEach((response) => {
        const foundIndex = result.findIndex(index => index.id === response.meetupid);
        /* istanbul ignore next */
        if (foundIndex !== -1) result.splice(foundIndex, 1);
      });
    }

    if (result.length === 0) return successResponse(res, 200, 'No upcoming meetups found.', result);
    return successResponse(res, 200, 'Upcoming Meetups found.', result);
  }

  /**
   * @description Deletes a meetup
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code and message
   */

  static async deleteMeetup(req, res) {
    const { id } = req.params;

    const meetupExists = await Meetup.getMeetupById(id);
    if (!meetupExists) return errorResponse(res, 404, 'Meetup not found.');

    await Meetup.deleteMeetup(id);
    return successResponse(res, 200, 'Meetup deleted successfully.', []);
  }

  static async getTopQuestions(req, res) {
    const { id } = req.params;

    const meetupExists = await Meetup.getMeetupById(id);
    if (!meetupExists) return errorResponse(res, 404, 'Meetup not found.');

    const result = await Meetup.getTopQuestions(id);
    if (result.length === 0) return successResponse(res, 200, 'No questions found.', []);
    return successResponse(res, 200, 'Top questions found.', result);
  }
}
