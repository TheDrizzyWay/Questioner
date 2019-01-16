import Comment from '../models/Comments';
import Question from '../models/Questions';
import { successResponse, errorResponse } from '../utils/responses';

export default {
  createComment: async (req, res) => {
    const newComment = req.body;

    const questionExists = await Question.getQuestionById(newComment.questionid);
    if (!questionExists) return errorResponse(res, 404, 'Question does not exist.');

    newComment.title = questionExists.title;
    newComment.body = questionExists.body;
    newComment.userid = req.user.id;

    const newCommentClass = new Comment(newComment);
    const result = await newCommentClass.createComment();
    return successResponse(res, 201, 'Comment posted.', result);
  },

  getCommentsByQuestion: async (req, res) => {
    const id = req.params.meetupid;

    const questionExists = await Question.getQuestionById(id);
    if (!questionExists) return errorResponse(res, 404, 'Question does not exist.');

    const result = await Comment.getCommentsByQuestion(id);
    if (result.length === 0) return errorResponse(res, 400, 'No comments found for this question.');
    return successResponse(res, 200, 'Comments Found', result);
  },
};
