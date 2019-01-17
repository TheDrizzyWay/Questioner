import Validator from 'validatorjs';
import { errorResponse } from '../utils/responses';
import customErrorMessages from '../utils/customerrormessages';

export default class CommentValidation {
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
