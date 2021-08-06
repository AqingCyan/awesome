import express from 'express';
import * as postController from './post.controller';
import { requestUrl } from '../app/app.middleware';
import { authGuard, accessControl } from '../auth/auth.middlerware';

const router = express.Router();

/**
 * 内容列表
 */
router.get('/posts', requestUrl, postController.index);

/**
 * 创建内容
 */
router.post('/posts', requestUrl, authGuard, postController.store);

/**
 * 更新内容
 */
router.patch(
  '/posts/:postId',
  requestUrl,
  authGuard, // 一定要先用 authGuard 验证登录状态，next 后，request 才有 user，才能进行访问控制
  accessControl({ possessions: true }),
  postController.update,
);

/**
 * 删除内容
 */
router.delete(
  '/posts/:postId',
  requestUrl,
  authGuard, // 一定要先用 authGuard 验证登录状态，next 后，request 才有 user，才能进行访问控制
  accessControl({ possessions: true }),
  postController.destroy,
);

export default router;
