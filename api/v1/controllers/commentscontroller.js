import Comment from '../models/Comments';
import Question from '../models/Questions';
import { successResponse, errorResponse } from '../utils/responses';
import { sanitizer } from '../utils/stringfunctions';

export default class CommentsController {
  /**
   * @description Posts a comment to a question
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @returns {object} contains details of the newly created comment
   */

  static async createComment(req, res) {
    const newComment = req.body;
    const { username } = req.user;

    const questionExists = await Question.getQuestionById(newComment.questionid);
    if (!questionExists) return errorResponse(res, 404, 'Question does not exist.');

    newComment.title = questionExists.title;
    newComment.body = questionExists.body;
    newComment.userid = req.user.id;
    newComment.comment = sanitizer(newComment.comment);
    newComment.postedby = username;

    const newCommentClass = new Comment(newComment);
    const result = await newCommentClass.createComment();
    return successResponse(res, 201, 'Comment posted.', result);
  }

  /**
   * @description Gets all comments for a particular question
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @returns {array} contains all comments for the specified question
   */

  static async getCommentsByQuestion(req, res) {
    const { id } = req.params;

    const questionExists = await Question.getQuestionById(id);
    if (!questionExists) return errorResponse(res, 404, 'Question does not exist.');

    const result = await Comment.getCommentsByQuestion(id);
    if (!result.length) return errorResponse(res, 404, 'No comments found for this question.');
    return successResponse(res, 200, 'Comments Found', result);
  }
}
