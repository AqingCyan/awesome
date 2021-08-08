import express from 'express';
import * as commentController from './comment.controller';
import { accessControl, authGuard } from '../auth/auth.middlerware';

const router = express.Router();

/**
 * 发表评论
 */
router.post('/comment', authGuard, commentController.store);

/**
 * 回复评论
 */
router.post('/comments/:commentId/replay', authGuard, commentController.replay);

/**
 * 修改评论
 */
router.patch(
  '/comments/:commentId',
  authGuard,
  accessControl({ possessions: true }),
  commentController.update,
);

export default router;
