import express from 'express';
import * as postController from './post.controller';
import { requestUrl } from '../app/app.middleware';
import { authGuard, accessControl } from '../auth/auth.middlerware';
import { sort, filter, paginate, validatePostStatus, modeSwitcher } from './post.middleware';
import { POSTS_PER_PAGE } from '../app/app.config';
import { accessLog } from '../access-log/access-log.middleware';

const router = express.Router();

/**
 * 内容列表
 */
router.get(
  '/posts',
  requestUrl,
  sort,
  filter,
  paginate(POSTS_PER_PAGE),
  validatePostStatus,
  modeSwitcher,
  accessLog({ action: 'getPosts', resourceType: 'post' }),
  postController.index,
);

/**
 * 创建内容
 */
router.post(
  '/posts',
  requestUrl,
  authGuard,
  validatePostStatus,
  accessLog({ action: 'createPost', resourceType: 'post', payloadParam: 'body.title' }),
  postController.store,
);

/**
 * 更新内容
 */
router.patch(
  '/posts/:postId',
  requestUrl,
  authGuard, // 一定要先用 authGuard 验证登录状态，next 后，request 才有 user，才能进行访问控制
  accessControl({ possessions: true }),
  validatePostStatus,
  accessLog({ action: 'updatePost', resourceType: 'post', resourceParamName: 'postId' }),
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
  accessLog({ action: 'deletePost', resourceType: 'post', resourceParamName: 'postId' }),
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
  accessLog({
    action: 'createPostTag',
    resourceType: 'post',
    resourceParamName: 'postId',
    payloadParam: 'body.name',
  }),
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
  accessLog({
    action: 'deletePostTag',
    resourceType: 'post',
    resourceParamName: 'postId',
    payloadParam: 'body.tagId',
  }),
  postController.destroyPostTag,
);

/**
 * 查询单个内容
 */
router.get(
  '/posts/:postId',
  accessLog({ action: 'getPostById', resourceType: 'post', resourceParamName: 'postId' }),
  postController.show,
);

export default router;
