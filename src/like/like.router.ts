import express from 'express';
import * as likeController from './like.controller';
import { authGuard } from '../auth/auth.middlerware';

const router = express.Router();

/**
 * 保存用户点赞内容
 */
router.post('/posts/:postId/like', authGuard, likeController.storeUserLikePost);

/**
 * 取消点赞内容
 */
router.delete('/posts/:postId/like', authGuard, likeController.destroyUserLikePost);

export default router;
