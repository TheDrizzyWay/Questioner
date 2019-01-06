import express from 'express';
import questionController from '../controllers/questioncontroller';
import validateQuestion from '../middleware/validatequestion';
import idValidator from '../middleware/idvalidator';

const {
  createQuestion, getAllQuestions, getOneQuestion,
  upvoteQuestion, downvoteQuestion,
} = questionController;

const router = express.Router();

router.post('/', validateQuestion, createQuestion);
router.get('/', getAllQuestions);
router.get('/:id', idValidator, getOneQuestion);
router.patch('/:id/upvote', idValidator, upvoteQuestion);
router.patch('/:id/downvote', idValidator, downvoteQuestion);

export default router;
