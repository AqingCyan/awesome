import express from 'express';
import * as postController from './post.controller';
import { requestUrl } from '../app/app.middleware';

const router = express.Router();

/**
 * 内容列表
 */
router.get('/posts', requestUrl, postController.index);

/**
 * 创建内容
 */
router.post('/posts', requestUrl, postController.store);

/**
 * 更新内容
 */
router.patch('/posts/:postId', requestUrl, postController.update);

/**
 * 删除内容
 */
router.delete('/posts/:postId', requestUrl, postController.destroy);

export default router;
