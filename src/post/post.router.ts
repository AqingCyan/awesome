import express from 'express';
import * as postController from './post.controller';
import { requestUrl } from '../app/app.middleware';
import { authGuard, accessControl } from '../auth/auth.middlerware';
import { sort, filter } from './post.middleware';

const router = express.Router();

/**
 * 内容列表
 */
router.get('/posts', requestUrl, sort, filter, postController.index);

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

/**
 * 添加内容标签
 */
router.post(
  '/posts/:postId/tag',
  requestUrl,
  authGuard,
  accessControl({ possessions: true }),
  postController.storePostTag,
);

/**
 * 移除内容标签
 */
router.delete(
  '/posts/:postId/tag',
  requestUrl,
  authGuard,
  accessControl({ possessions: true }),
  postController.destroyPostTag,
);

export default router;
