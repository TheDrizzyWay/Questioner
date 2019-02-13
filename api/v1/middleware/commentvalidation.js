import Validator from 'validatorjs';
import { errorResponse } from '../utils/responses';
import customErrorMessages from '../utils/customerrormessages';

export default class CommentValidation {
  /**
   * @description Validates the request payload for creating a comment
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @param {object} next - The next middleware
   * @returns Status code and error message or next()
   */

  static validCreate(req, res, next) {
    const comments = req.body;

    const commentProperties = {
      questionid: 'required|numeric',
      comment: 'required|string|max:500',
    };

    const validator = new Validator(comments, commentProperties, customErrorMessages);
    validator.passes(() => next());
    validator.fails(() => {
      const errors = validator.errors.all();
      return errorResponse(res, 400, errors);
    });
  }
}
