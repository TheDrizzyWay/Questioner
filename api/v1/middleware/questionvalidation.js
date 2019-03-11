import Validator from 'validatorjs';
import { errorResponse } from '../utils/responses';
import customErrorMessages from '../utils/customerrormessages';

export default class QuestionValidation {
  /**
   * @description Validates the request payload for creating a new question
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @param {object} next - The next middleware
   * @returns Status code and error message or next()
   */

  static validCreate(req, res, next) {
    const question = req.body;

    const questionProperties = {
      meetupid: 'required|numeric',
      title: 'required|string|max:200',
      body: 'required|string|max:500',
    };

    const validator = new Validator(question, questionProperties, customErrorMessages);
    validator.passes(() => next());
    validator.fails(() => {
      const errors = validator.errors.all();
      return errorResponse(res, 400, errors);
    });
  }
}
