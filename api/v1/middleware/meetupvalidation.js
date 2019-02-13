import Validator from 'validatorjs';
import { errorResponse } from '../utils/responses';
import customErrorMessages from '../utils/customerrormessages';

export default class MeetupValidation {
  /**
   * @description Validates the request payload for creating a new meetup
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @param {object} next - The next middleware
   * @returns Status code and error message or next()
   */

  static validCreate(req, res, next) {
    const meetup = req.body;

    const meetupProperties = {
      topic: 'required|string|min:1|max:255',
      location: 'required|string|min:1',
      happeningon: ['required', 'date', 'regex:/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}/'],
      tags: 'array|min:1|max:10',
      'tags.*': 'alpha_num',
    };

    const validator = new Validator(meetup, meetupProperties, customErrorMessages);
    validator.passes(() => next());
    validator.fails(() => {
      const errors = validator.errors.all();
      return errorResponse(res, 400, errors);
    });
  }

  static checkTags(req, res, next) {
    /**
     * @description Filters out repeated tags
     * @param  {object} req - The request object
     * @param  {object} res - The response object
     * @param {object} next - The next middleware
     * @returns next()
     */

    const meetup = req.body;
    if (meetup.tags) {
      const tagSet = new Set(meetup.tags);
      meetup.tags = [...tagSet];
    }
    next();
  }

  static checkDate(req, res, next) {
    /**
     * @description Validates the date in the request payload
     * @param  {object} req - The request object
     * @param  {object} res - The response object
     * @param {object} next - The next middleware
     * @returns Status code and error message or next()
     */

    const { happeningon } = req.body;
    const currentDate = new Date(Date.now());
    const meetupDate = new Date(happeningon);

    if (currentDate > meetupDate) {
      return errorResponse(res, 400, `Your Date should be greater than ${currentDate}.`);
    }
    return next();
  }

  static validEdit(req, res, next) {
    /**
     * @description Validates the request payload for editing user details
     * @param  {object} req - The request object
     * @param  {object} res - The response object
     * @param {object} next - The next middleware
     * @returns Status code and error message or next()
     */

    const meetup = req.body;

    const meetupProperties = {
      topic: 'string|min:1|max:255',
      location: 'string|min:1',
      happeningon: ['date', 'regex:/[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}/'],
      tags: 'array|min:1|max:10',
      'tags.*': 'alpha_num',
    };

    const validator = new Validator(meetup, meetupProperties, customErrorMessages);
    validator.passes(() => next());
    validator.fails(() => {
      const errors = validator.errors.all();
      return errorResponse(res, 400, errors);
    });
  }

  static checkDateEdit(req, res, next) {
    if (req.body.happeningon) {
      const currentDate = new Date(Date.now());
      const meetupDate = new Date(req.body.happeningon);

      if (currentDate > meetupDate) {
        return errorResponse(res, 400, `Your Date should be greater than ${currentDate}.`);
      }
    }
    return next();
  }
}
