import Validator from 'validatorjs';
import { errorResponse } from '../utils/responses';
import customErrorMessages from '../utils/customerrormessages';

export default class QuestionValidation {
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
