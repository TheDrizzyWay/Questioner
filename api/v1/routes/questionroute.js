import express from 'express';
import QuestionsController from '../controllers/questionscontroller';
import QuestionValidation from '../middleware/questionvalidation';
import idValidation from '../middleware/idvalidation';
import { requireAuth } from '../middleware/authentication';
import tryCatch from '../utils/trycatch';

const {
  createQuestion, upvoteQuestion, downvoteQuestion, getQuestionsByMeetup,
} = QuestionsController;
const { validCreate } = QuestionValidation;

const router = express.Router();

router.post('/', requireAuth, validCreate, tryCatch(createQuestion));
router.get('/:id', requireAuth, idValidation, tryCatch(getQuestionsByMeetup));
router.patch('/:id/upvote', requireAuth, idValidation, tryCatch(upvoteQuestion));
router.patch('/:id/downvote', requireAuth, idValidation, tryCatch(downvoteQuestion));

export default router;
