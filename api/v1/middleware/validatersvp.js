import Validator from 'validatorjs';
import { badResponse } from '../utils/responses';

export default class RsvpValidation {
  static validRsvp(req, res, next) {
    const rsvp = req.body;

    const rsvpProperties = {
      response: ['required', { in: ['yes', 'no', 'maybe'] }],
    };

    const validator = new Validator(rsvp, rsvpProperties);
    validator.passes(() => next());
    validator.fails(() => {
      const errors = validator.errors.all();
      return badResponse(res, 400, errors);
    });
  }
}
