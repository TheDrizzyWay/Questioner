import express from 'express';
import questionsController from '../controllers/questionscontroller';
import QuestionValidation from '../middleware/questionvalidation';
import { requireAuth } from '../middleware/authentication';

const { createQuestion } = questionsController;

const router = express.Router();

router.post('/', requireAuth, QuestionValidation.validCreate, createQuestion);

export default router;
