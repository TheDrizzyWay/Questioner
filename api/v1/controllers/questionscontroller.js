import Question from '../models/Questions';
import Meetup from '../models/Meetups';
import Rsvp from '../models/Rsvps';
import { sanitizer } from '../utils/stringfunctions';
import { successResponse, errorResponse } from '../utils/responses';

export default class QuestionsController {
  /**
   * @description Creates a question for a particular meetup
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and question details
   */

  static async createQuestion(req, res) {
    const { id, username } = req.user;
    req.body.userid = id;
    const question = new Question(req.body);

    question.title = sanitizer(question.title);
    question.body = sanitizer(question.body);

    const meetupExists = await Meetup.getMeetupById(question.meetupid);
    if (!meetupExists) return errorResponse(res, 404, 'Meetup not found.');

    const ifJoined = await Rsvp.getUserByRsvp(meetupExists.id, id);
    if (!ifJoined || ifJoined.response === 'no' || ifJoined.response === 'maybe') {
      return errorResponse(res, 401, 'You have not joined this meetup.');
    }

    const result = await question.createQuestion();
    result.topic = meetupExists.topic;
    result.username = username;
    return successResponse(res, 201, 'Your question has been recorded.', result);
  }

  /**
   * @description Upvotes a question
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and the upvoted question
   */

  static async upvoteQuestion(req, res) {
    const questionid = req.params.id;
    const userid = req.user.id;

    const questionExists = await Question.getQuestionById(questionid);
    if (!questionExists) return errorResponse(res, 404, 'Question not found.');

    if (questionExists.userid === userid) {
      return errorResponse(res, 400, 'You can not vote on your own question.');
    }

    const voted = await Question.ifVoted(userid, questionid);
    if (voted) {
      if (voted.vote === 'downvoted') {
        const upvoteErrorMessage = 'You have downvoted this question. Click on the'
        + ' downvote button again to remove your downvote.';
        return errorResponse(res, 400, upvoteErrorMessage);
      }
      await Question.changeVotesTable(userid, questionid);
      const changeVote = await Question.changeUpvoteQuestion(questionid);
      return successResponse(res, 200, 'You have removed your upvote.', changeVote);
    }

    const vote = 'upvoted';
    const result = await Question.upvoteQuestion(questionid);
    await Question.updateVotesTable(userid, questionid, vote);
    return successResponse(res, 200, `Question ${vote}.`, result);
  }

  /**
   * @description Downvotes a question
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and the upvoted question
   */

  static async downvoteQuestion(req, res) {
    const questionid = req.params.id;
    const userid = req.user.id;

    const questionExists = await Question.getQuestionById(questionid);
    if (!questionExists) return errorResponse(res, 404, 'Question not found.');

    if (questionExists.userid === userid) {
      return errorResponse(res, 400, 'You can not vote on your own question.');
    }

    const voted = await Question.ifVoted(userid, questionid);
    if (voted) {
      if (voted.vote === 'upvoted') {
        const downvoteErrorMessage = 'You have upvoted this question. Click on the'
        + ' upvote button again to remove your upvote.';
        return errorResponse(res, 400, downvoteErrorMessage);
      }
      await Question.changeVotesTable(userid, questionid);
      const changeVote = await Question.changeDownvoteQuestion(questionid);
      return successResponse(res, 200, 'You have removed your downvote.', changeVote);
    }

    const vote = 'downvoted';
    const result = await Question.downvoteQuestion(questionid);
    await Question.updateVotesTable(userid, questionid, vote);
    return successResponse(res, 200, `Question ${vote}.`, result);
  }
}
