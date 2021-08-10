import express from 'express';
import * as commentController from './comment.controller';
import { accessControl, authGuard } from '../auth/auth.middlerware';
import { filter } from './comment.middleware';
import { paginate } from '../post/post.middleware';
import { COMMENT_PER_PAGE } from '../app/app.config';

const router = express.Router();

/**
 * 发表评论
 */
router.post('/comments', authGuard, commentController.store);

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

/**
 * 删除评论
 */
router.delete(
  '/comments/:commentId',
  authGuard,
  accessControl({ possessions: true }),
  commentController.destroyComment,
);

/**
 * 评论列表
 */
router.get(
  '/comments',
  filter,
  paginate(COMMENT_PER_PAGE),
  commentController.index,
);

/**
 * 回复列表
 */
router.get('/comments/:commentId/replies', commentController.indexReplies);

export default router;
