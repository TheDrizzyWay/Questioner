import Question from '../models/Questions';
import Meetup from '../models/Meetups';
import { successResponse, errorResponse } from '../utils/responses';

export default {
  /**
   * @description Creates a question for a particular meetup
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and question details
   */

  createQuestion: async (req, res) => {
    const { id } = req.user;
    req.body.userid = id;
    const question = new Question(req.body);

    question.title = question.title.replace(/([@#$%&=<>*/\\])/g, '').trim();
    question.body = question.body.replace(/([@#$%&<>*=/\\])/g, '').trim();

    const meetupExists = await Meetup.getMeetupById(question.meetupid);
    if (!meetupExists) return errorResponse(res, 404, 'Meetup not found.');

    const result = await question.createQuestion();
    result.topic = meetupExists.topic;
    return successResponse(res, 201, 'Your question has been recorded.', result);
  },

  /**
   * @description Upvotes a question
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and the upvoted question
   */

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

  /**
   * @description Downvotes a question
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and the upvoted question
   */

  downvoteQuestion: async (req, res) => {
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
    const result = await Question.downvoteQuestion(questionid);
    await Question.updateVotesTable(userid, questionid, vote);
    return successResponse(res, 200, `Question ${vote}.`, result);
  },
};
