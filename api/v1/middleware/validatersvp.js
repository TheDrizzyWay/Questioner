import Validator from 'validatorjs';
import trim from './trim';

export default class RsvpValidation {
  static validRsvp(req, res, next) {
    const rsvp = req.body;
    rsvp.meetup = rsvp.meetup;
    rsvp.response = trim(rsvp.response);

    const rsvpProperties = {
      meetup: 'required|numeric',
      response: ['required', { in: ['yes', 'no', 'maybe'] }],
    };

    const validator = new Validator(rsvp, rsvpProperties);
    validator.passes(() => next());
    validator.fails(() => {
      const errors = validator.errors.all();
      return res.status(400).json({ status: 400, error: errors });
    });
  }
}
