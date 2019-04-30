import Comment from '../models/Comments';
import Question from '../models/Questions';
import { successResponse, errorResponse } from '../utils/responses';
import { sanitizer } from '../utils/stringfunctions';
import paginate from '../utils/pagination';

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
    const page = parseInt(req.query.page, 10) || 1;

    const questionExists = await Question.getQuestionById(id);
    if (!questionExists) return errorResponse(res, 404, 'Question does not exist.');

    const result = await Comment.getCommentsByQuestion(id, 0, null);
    if (!result.length) return errorResponse(res, 404, 'No comments found for this question.');

    const pages = Math.ceil(result.length / 5);
    if (page > pages) return errorResponse(res, 404, 'No comments here.');

    const offset = (page - 1) * 5;
    const paginatedResult = await Comment.getCommentsByQuestion(id, offset, 5);
    const meta = paginate(page, pages);
    const pageResult = {
      paginatedResult,
      meta,
    };
    paginatedResult.metadata = meta;
    return successResponse(res, 200, 'Comments Found', pageResult);
  }
}
