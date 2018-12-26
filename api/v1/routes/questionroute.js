import express from 'express';
import questionController from '../controllers/questioncontroller';
import validateQuestion from '../middleware/validatequestion';

const { createQuestion } = questionController;

const router = express.Router();

router.post('/', validateQuestion, createQuestion);

export default router;
