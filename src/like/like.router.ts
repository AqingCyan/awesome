import express from 'express';
import * as likeController from './like.controller';
import { authGuard } from '../auth/auth.middlerware';
import { accessLog } from '../access-log/access-log.middleware';

const router = express.Router();

/**
 * 保存用户点赞内容
 */
router.post(
  '/posts/:postId/like',
  authGuard,
  accessLog({ action: 'createUserLikePost', resourceType: 'post', resourceParamName: 'postId' }),
  likeController.storeUserLikePost,
);

/**
 * 取消点赞内容
 */
router.delete(
  '/posts/:postId/like',
  authGuard,
  accessLog({ action: 'deleteUserLikePost', resourceType: 'post', resourceParamName: 'postId' }),
  likeController.destroyUserLikePost,
);

export default router;
