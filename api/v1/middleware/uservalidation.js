import Validator from 'validatorjs';
import { badResponse } from '../utils/responses';

export default class UserValidation {
  static validSignUp(req, res, next) {
    const user = req.body;

    const userProperties = {
      firstname: 'required|alpha|min:2|max:50',
      lastname: 'required|alpha|min:2|max:50',
      othername: 'alpha|min:2|max:50',
      username: 'required|alpha_num|min:5|max:50',
      email: 'required|email|max:100',
      password: 'required|alpha_num|min:6|max:18',
      phonenumber: 'required|numeric|min:11',
    };

    const validator = new Validator(user, userProperties);
    validator.passes(() => next());
    validator.fails(() => {
      const errors = validator.errors.all();
      return badResponse(res, 400, errors);
    });
  }

  static validLogin(req, res, next) {
    const user = req.body;

    const userProperties = {
      email: 'required|email|max:100',
      password: 'required|alpha_num|min:6|max:18',
    };

    const validator = new Validator(user, userProperties);
    validator.passes(() => next());
    validator.fails(() => {
      const errors = validator.errors.all();
      return badResponse(res, 400, errors);
    });
  }
}
