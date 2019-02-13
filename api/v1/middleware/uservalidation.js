import Validator from 'validatorjs';
import { errorResponse } from '../utils/responses';
import customErrorMessages from '../utils/customerrormessages';

export default class UserValidation {
  static validSignUp(req, res, next) {
    /**
     * @description Validates the request payload for user signup
     * @param  {object} req - The request object
     * @param  {object} res - The response object
     * @param {object} next - The next middleware
     * @returns Status code and error message or next()
     */

    const user = req.body;

    const userProperties = {
      firstname: 'required|alpha|min:2|max:50',
      lastname: 'required|alpha|min:2|max:50',
      username: 'required|alpha_num|min:5|max:50',
      email: 'required|email|max:100',
      password: 'required|alpha_num|min:6|max:18',
      password_confirmation: 'required_with:password|same:password',
      phonenumber: 'required|digits:11',
    };

    const validator = new Validator(user, userProperties, customErrorMessages);
    validator.passes(() => next());
    validator.fails(() => {
      const errors = validator.errors.all();
      return errorResponse(res, 400, errors);
    });
  }

  static validLogin(req, res, next) {
    /**
     * @description Validates the request payload for user login
     * @param  {object} req - The request object
     * @param  {object} res - The response object
     * @param {object} next - The next middleware
     * @returns Status code and error message or next()
     */

    const user = req.body;

    const userProperties = {
      email: 'required|email|max:100',
      password: 'required|alpha_num|min:6|max:18',
    };

    const validator = new Validator(user, userProperties, customErrorMessages);
    validator.passes(() => next());
    validator.fails(() => {
      const errors = validator.errors.all();
      return errorResponse(res, 400, errors);
    });
  }

  static validEdit(req, res, next) {
    /**
     * @description Validates the request payload for updating user details
     * @param  {object} req - The request object
     * @param  {object} res - The response object
     * @param {object} next - The next middleware
     * @returns Status code and error message or next()
     */

    const user = req.body;

    const userProperties = {
      firstname: 'alpha|min:2|max:50',
      lastname: 'alpha|min:2|max:50',
      username: 'alpha_num|min:5|max:50',
      email: 'email|max:100',
      password: 'alpha_num|min:6|max:18|confirmed',
      password_confirmation: 'required_with:password|same:password',
      phonenumber: 'digits:11',
    };

    const validator = new Validator(user, userProperties, customErrorMessages);
    validator.passes(() => next());
    validator.fails(() => {
      const errors = validator.errors.all();
      return errorResponse(res, 400, errors);
    });
  }
}
