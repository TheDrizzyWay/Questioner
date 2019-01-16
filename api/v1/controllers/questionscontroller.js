import Question from '../models/Questions';
import Meetup from '../models/Meetups';
import { successResponse, errorResponse } from '../utils/responses';

export default {
  createQuestion: async (req, res) => {
    const { id } = req.user;
    req.body.userid = id;
    const question = new Question(req.body);

    question.title = question.title.replace(/([^a-zA-z0-9\s])/g, '');
    question.body = question.body.replace(/([^a-zA-z0-9\s])/g, '');

    const meetupExists = await Meetup.getMeetupById(question.meetupid);
    if (!meetupExists) return errorResponse(res, 404, 'Meetup not found.');

    const result = await question.createQuestion();
    return successResponse(res, 201, 'Your question has been recorded.', result);
  },
};
