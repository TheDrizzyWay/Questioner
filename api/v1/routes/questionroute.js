import express from 'express';
import questionsController from '../controllers/questionscontroller';
import QuestionValidation from '../middleware/questionvalidation';
import idValidation from '../middleware/idvalidation';
import { requireAuth } from '../middleware/authentication';
import tryCatch from '../utils/trycatch';

const { createQuestion, upvoteQuestion, downvoteQuestion } = questionsController;

const router = express.Router();

router.post('/', requireAuth, QuestionValidation.validCreate, tryCatch(createQuestion));
router.patch('/:id/upvote', requireAuth, idValidation, tryCatch(upvoteQuestion));
router.patch('/:id/downvote', requireAuth, idValidation, tryCatch(downvoteQuestion));

export default router;
