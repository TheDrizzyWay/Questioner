import Validator from 'validatorjs';
import { errorResponse } from '../utils/responses';

export default class RsvpValidation {
  /**
   * @description Validates the request payload for responding to a meetup
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @param {object} next - The next middleware
   * @returns Status code and error message or next()
   */

  static validRsvp(req, res, next) {
    const userResponse = req.body;
    if (userResponse.response) {
      userResponse.response = userResponse.response.trim().toLowerCase();
    }

    const responseProperties = {
      response: ['required', { in: ['yes', 'no', 'maybe'] }],
    };

    const validator = new Validator(userResponse, responseProperties);
    validator.passes(() => next());
    validator.fails(() => {
      const errorMessage = 'Your response should be either Yes, No, or Maybe';
      return errorResponse(res, 400, errorMessage);
    });
  }
}
