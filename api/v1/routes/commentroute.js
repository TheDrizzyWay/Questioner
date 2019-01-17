import express from 'express';
import commentsController from '../controllers/commentscontroller';
import CommentValidation from '../middleware/commentvalidation';
import idValidation from '../middleware/idvalidation';
import { requireAuth } from '../middleware/authentication';
import tryCatch from '../utils/trycatch';

const { createComment, getCommentsByQuestion } = commentsController;

const router = express.Router();

router.post('/', requireAuth, CommentValidation.validCreate, tryCatch(createComment));
router.get('/:id', requireAuth, idValidation, tryCatch(getCommentsByQuestion));

export default router;
