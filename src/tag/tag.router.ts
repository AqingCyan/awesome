import express from 'express';
import * as tagController from './tag.controller';
import { authGuard } from '../auth/auth.middlerware';

const router = express.Router();

/**
 * 创建标签
 */
router.post('/tag', authGuard, tagController.store);

export default router;
