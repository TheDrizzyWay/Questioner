import Validator from 'validatorjs';
import { badResponse } from '../utils/responses';

export default class QuestionValidation {
  static validQuestion(req, res, next) {
    const question = req.body;
    question.meetup = parseInt(question.meetup, 10);
    question.createdBy = parseInt(question.createdBy, 10);

    const questionProperties = {
      meetup: 'required|numeric',
      title: 'required|string|max:100',
      body: 'required|string|max:500',
      createdBy: 'required|numeric',
    };

    const validator = new Validator(question, questionProperties);
    validator.passes(() => next());
    validator.fails(() => {
      const errors = validator.errors.all();
      return badResponse(res, 400, errors);
    });
  }
}
