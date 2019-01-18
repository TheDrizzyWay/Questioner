import Comment from '../models/Comments';
import Question from '../models/Questions';
import { successResponse, errorResponse } from '../utils/responses';

export default {
  /**
   * @description Posts a comment to a question
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and comment details
   */

  createComment: async (req, res) => {
    const newComment = req.body;

    const questionExists = await Question.getQuestionById(newComment.questionid);
    if (!questionExists) return errorResponse(res, 404, 'Question does not exist.');

    newComment.title = questionExists.title;
    newComment.body = questionExists.body;
    newComment.userid = req.user.id;
    newComment.comment = newComment.comment.replace(/([@#$%&<>=*/\\])/g, '');

    const newCommentClass = new Comment(newComment);
    const result = await newCommentClass.createComment();
    return successResponse(res, 201, 'Comment posted.', result);
  },

  /**
   * @description Gets all comments for a particular question
   * @param  {Object} req - The request object
   * @param  {object} res - The response object
   * @returns status code, message and all available comments
   */

  getCommentsByQuestion: async (req, res) => {
    const { id } = req.params;

    const questionExists = await Question.getQuestionById(id);
    if (!questionExists) return errorResponse(res, 404, 'Question does not exist.');

    const result = await Comment.getCommentsByQuestion(id);
    if (result.length === 0) return errorResponse(res, 404, 'No comments found for this question.');
    return successResponse(res, 200, 'Comments Found', result);
  },
};
