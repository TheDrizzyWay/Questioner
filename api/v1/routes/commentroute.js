import express from 'express';
import commentsController from '../controllers/commentscontroller';
import { requireAuth } from '../middleware/authentication';
import tryCatch from '../utils/trycatch';

const { createComment, getCommentsByQuestion } = commentsController;

const router = express.Router();

router.post('/', requireAuth, tryCatch(createComment));
router.get('/:meetupid', requireAuth, tryCatch(getCommentsByQuestion));

export default router;
