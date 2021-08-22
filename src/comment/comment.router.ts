import express from 'express';
import * as commentController from './comment.controller';
import { accessControl, authGuard } from '../auth/auth.middlerware';
import { filter } from './comment.middleware';
import { paginate } from '../post/post.middleware';
import { COMMENT_PER_PAGE } from '../app/app.config';
import { accessLog } from '../access-log/access-log.middleware';

const router = express.Router();

/**
 * 发表评论
 */
router.post(
  '/comments',
  authGuard,
  accessLog({ action: 'createComment', resourceType: 'comment', payloadParam: 'body.content' }),
  commentController.store,
);

/**
 * 回复评论
 */
router.post(
  '/comments/:commentId/replay',
  authGuard,
  accessLog({
    action: 'createCommentReply',
    resourceType: 'comment',
    resourceParamName: 'commentId',
    payloadParam: 'body.content',
  }),
  commentController.replay,
);

/**
 * 修改评论
 */
router.patch(
  '/comments/:commentId',
  authGuard,
  accessControl({ possessions: true }),
  accessLog({
    action: 'updateComment',
    resourceType: 'comment',
    resourceParamName: 'commentId',
    payloadParam: 'body.content',
  }),
  commentController.update,
);

/**
 * 删除评论
 */
router.delete(
  '/comments/:commentId',
  authGuard,
  accessControl({ possessions: true }),
  accessLog({
    action: 'deleteComment',
    resourceType: 'comment',
    resourceParamName: 'commentId',
  }),
  commentController.destroyComment,
);

/**
 * 评论列表
 */
router.get(
  '/comments',
  filter,
  paginate(COMMENT_PER_PAGE),
  accessLog({
    action: 'getComment',
    resourceType: 'comment',
  }),
  commentController.index,
);

/**
 * 回复列表
 */
router.get(
  '/comments/:commentId/replies',
  accessLog({
    action: 'getCommentReplies',
    resourceType: 'comment',
  }),
  commentController.indexReplies,
);

export default router;
