import Rsvp from '../models/Rsvps';
import Meetup from '../models/Meetups';
import { successResponse, errorResponse } from '../utils/responses';

export default class RsvpController {
  /**
   * @description Adds a user to a meetup
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @returns {object} contains details of the user response
   */

  static async joinMeetup(req, res) {
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
  }

  /**
   * @description Gets the meetups a user has joined
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @returns {array} contains all meetups joined by the user
   */

  static async getJoinedMeetups(req, res) {
    const { id } = req.user;
    const response = 'yes';

    const result = await Rsvp.getJoinedMeetups(id, response);
    if (!result.length) return successResponse(res, 200, 'You have not joined any meetups yet.', result);
    return successResponse(res, 200, 'Joined meetups found.', result);
  }
}
