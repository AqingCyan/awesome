import express from 'express';
import * as commentController from './comment.controller';
import { authGuard } from '../auth/auth.middlerware';

const router = express.Router();

/**
 * 发表评论
 */
router.post('/comment', authGuard, commentController.store);

/**
 * 回复评论
 */
router.post('/comments/:commentId/replay', authGuard, commentController.replay);

export default router;
