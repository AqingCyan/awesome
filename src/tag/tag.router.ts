import express from 'express';
import * as tagController from './tag.controller';
import { authGuard } from '../auth/auth.middlerware';
import { accessLog } from '../access-log/access-log.middleware';

const router = express.Router();

/**
 * 创建标签
 */
router.post(
  '/tag',
  authGuard,
  accessLog({ action: 'createTag', resourceType: 'tag', payloadParam: 'body.name' }),
  tagController.store,
);

export default router;
