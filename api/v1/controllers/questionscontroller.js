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

  upvoteQuestion: async (req, res) => {
    const questionid = req.params.id;
    const userid = req.user.id;
    const userAction = req.originalUrl;

    const questionExists = await Question.getQuestionById(questionid);
    if (!questionExists) return errorResponse(res, 404, 'Question not found.');

    if (questionExists.userid === userid) {
      return errorResponse(res, 400, 'You can not vote on your own question.');
    }

    const voted = await Question.ifVoted(userid, questionid);
    if (voted) {
      return errorResponse(res, 400, `You have already ${voted.vote} this question`);
    }

    const userActionArray = userAction.split('/');
    const vote = `${userActionArray[userActionArray.length - 1]}d`;
    const result = await Question.upvoteQuestion(questionid);
    await Question.updateVotesTable(userid, questionid, vote);
    return successResponse(res, 200, `Question ${vote}.`, result);
  },
};
