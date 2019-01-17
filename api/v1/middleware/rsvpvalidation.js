import Validator from 'validatorjs';
import { errorResponse } from '../utils/responses';

export default class RsvpValidation {
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
