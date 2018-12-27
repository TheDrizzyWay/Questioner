import express from 'express';
import questionController from '../controllers/questioncontroller';
import validateQuestion from '../middleware/validatequestion';
import idValidator from '../middleware/idvalidator';

const { createQuestion, getAllQuestions, getOneQuestion } = questionController;

const router = express.Router();

router.post('/', validateQuestion, createQuestion);
router.get('/', getAllQuestions);
router.get('/:id', idValidator, getOneQuestion);

export default router;
