import Validator from 'validatorjs';

export default class MeetupValidation {
  static validMeetup(req, res, next) {
    const meetup = req.body;

    const meetupProperties = {
      topic: 'required|string|min:1',
      location: 'required|string|min:1',
      happeningOn: ['required', 'date', 'regex:/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}/'],
      images: 'array|max:2',
      tags: 'array|max:10',
      'images.*': 'url',
      'tags.*': 'alpha_num',
    };

    const validator = new Validator(meetup, meetupProperties);
    validator.passes(() => next());
    validator.fails(() => {
      const errors = validator.errors.all();
      return res.status(400).json({ status: 400, error: errors });
    });
  }
}
