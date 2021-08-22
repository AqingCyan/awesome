import express from 'express';
import * as avatarController from './avatar.controller';
import { authGuard } from '../auth/auth.middlerware';
import { avatarInterceptor, avatarProcessor } from './avatar.middleware';
import { accessLog } from '../access-log/access-log.middleware';

const router = express.Router();

/**
 * 上传头像
 */
router.post(
  '/avatar',
  authGuard,
  avatarInterceptor,
  avatarProcessor,
  accessLog({ action: 'createAvatar', resourceType: 'avatar' }),
  avatarController.store,
);

/**
 * 头像查询服务
 */
router.get('/avatar/:userId/avatar', avatarController.serve);

export default router;
