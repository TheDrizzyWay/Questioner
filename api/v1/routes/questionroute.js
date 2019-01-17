import express from 'express';
import questionsController from '../controllers/questionscontroller';
import QuestionValidation from '../middleware/questionvalidation';
import idValidation from '../middleware/idvalidation';
import { requireAuth } from '../middleware/authentication';

const { createQuestion, upvoteQuestion } = questionsController;

const router = express.Router();

router.post('/', requireAuth, QuestionValidation.validCreate, createQuestion);
router.patch('/:id/upvote', requireAuth, idValidation, upvoteQuestion);

export default router;
